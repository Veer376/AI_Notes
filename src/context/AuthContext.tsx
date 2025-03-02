import {createContext, useEffect, useState, useContext} from 'react';
import {getProfile, loginUser, logoutUser, registerUser} from '../services/api';


interface AuthContextType{
    user: any,
    loading: boolean,
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: ()=>Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: any})=>{
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(()=>{
        const fetchUser = async ()=>{
            try{
                const response = await getProfile();
                setUser({email : response.email});
                setLoading(false);
            }catch(error){
                setUser(null);
                setLoading(false);
            }
            
        }

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{user, loading, 
            login: async(email: string, password: string)=>{
                const response = await loginUser(email, password);
                setUser({email: response.email});
                console.log(user);
            },
            register: async(email: string, password: string) => {
                await registerUser(email, password);
                //do nothing.
            },
            logout: async()=>{
                await logoutUser();
                setUser(null);
            } }}

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