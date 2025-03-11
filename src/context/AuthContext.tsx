import {createContext, useEffect, useState, useContext} from 'react';
import {getProfile, loginUser, logoutUser, registerUser, saveCanvas} from '../services/api';
import { List } from 'immutable';

type Note = {
    title: string,
    value: string
}
type User = {
    email: string,
    notes: Note[] | null
}

interface AuthContextType {
    user: User | null,
    loading: boolean,
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: ()=>Promise<void>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: any})=>{
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(()=>{
        const fetchUser = async ()=>{
            try{
                const data = await getProfile();
                setUser({email: data.email, notes: data.notes});
                console.log('user->', user);
            }catch(error){
                setUser(null);
                setLoading(false);
            }finally{
                setLoading(false);
            }
        }

        fetchUser();
    }, [saveCanvas]);

    return (
        <AuthContext.Provider value={{user, loading, 
            login: async(email: string, password: string)=>{
                const data = await loginUser(email, password);
                setUser({email: data.email, notes: data.notes}); 
            },
            register: async(email: string, password: string) => {
                await registerUser(email, password);
                //do nothing.
            },
            logout: async()=>{
                await logoutUser();
                setUser(null);
            },
            setUser: setUser
         }}

        > 
        {children} 
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context; //it will return the AuthContextType object containing user, loading, login, register, logout.
}