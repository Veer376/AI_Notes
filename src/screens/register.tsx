import { useState} from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function Register() {
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [hasEmailText, setHasEmailText] = useState(false);
    const [hasPasswordText, setHasPasswordText] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    const [hasConfirmPasswordText, setHasConfirmPasswordText] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {register} = useAuth();
    const navigate = useNavigate();
    const handleRegister = async (event: any) => {
        event.preventDefault();

        if(!email.trim() || password!==confirmPassword){
            alert("Please enter the valid email or password");
            return;
        }
        try{
            await register(email, password);
            navigate('/login', {replace : true})
        } catch(error : any){
            if(error.response.status===409) {
                alert("User already exists");
                navigate('/login', {replace : true});
            }
            console.error("Registration failed:", error);
        }        
    }

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center ">
            <div className="absolute top-4 left-4 text-3xl font-bold text-gray-700">Sketch AI</div>

            <div className="flex flex-col items-center bg-white p-10 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-12">Welcome, </h1> 

                <form className="flex flex-col w-80 space-y-8" onSubmit={handleRegister}>
                    {/* Email Input */}
                    <div className="relative w-full">
                        <input
                            type="email"
                            placeholder=""
                            className="w-full p-4 pt-6 border-2 items-center border-gray-300 rounded-full outline-none focus:border-blue-500 focus:ring-0 peer"
                            onFocus={() => setEmailFocused(true)}
                            onBlur={(e) => {
                                setEmailFocused(false);
                                setHasEmailText(e.target.value.trim() !== ""); // Check if text exists
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label
                            className={`pointer-events-none absolute left-5 transition-all bg-white px-2 rounded-2xl
                                ${emailFocused? "top-2 -translate-y-2/3 text-blue-500" : ""}
                                ${hasEmailText? "top-2 -translate-y-2/3 text-gray-400" : "top-5 text-gray-400"}
                            peer-focus:top-2 peer-focus:text-blue-500`}
                        >
                            Enter your email
                        </label>
                    </div>
                    {/* Password Input */}
                    <div className="relative w-full">
                        <input
                            type="password"
                            placeholder=""
                            className="w-full p-4 pt-6 border-2 items-center border-gray-300 rounded-full outline-none focus:border-blue-500 focus:ring-0 peer"
                            onFocus={() => setConfirmPasswordFocused(true)}
                            onBlur={(e) => {
                                setConfirmPasswordFocused(false);
                                setHasConfirmPasswordText(e.target.value.trim() !== ""); // Check if text exists
                            }}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label
                            className={`pointer-events-none absolute left-5 transition-all bg-white px-2 rounded-2xl
                                ${confirmPasswordFocused? "top-2 -translate-y-2/3 text-blue-500" : "" }
                                ${hasConfirmPasswordText? "top-2 -translate-y-2/3 text-gray-400" : "top-5 text-gray-400"}
                            peer-focus:top-2 peer-focus:text-blue-500`}
                        >
                            Enter password
                        </label>
                    </div>
                    {/* Confirm Password Input */}
                    <div className="relative w-full">
                        <input
                            type="password"
                            placeholder=""
                            className="w-full p-4 pt-6 border-2 items-center border-gray-300 rounded-full outline-none focus:border-blue-500 focus:ring-0 peer"
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={(e) => {
                                setPasswordFocused(false);
                                setHasPasswordText(e.target.value.trim() !== ""); // Check if text exists
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label
                            className={`pointer-events-none absolute left-5 transition-all bg-white px-2 rounded-2xl
                                ${passwordFocused? "top-2 -translate-y-2/3 text-blue-500" : "" }
                                ${hasPasswordText? "top-2 -translate-y-2/3 text-gray-400" : "top-5 text-gray-400"}
                            peer-focus:top-2 peer-focus:text-blue-500`}
                        >
                            confirm password
                        </label>
                    </div>

                    <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-6 text-lg rounded-lg hover:bg-blue-600 transition-all mx-auto">
                        SignUp
                    </button>
                    <div className="text-center mt-4">
                        <span className="text-black">Already have an account? </span>
                        <a href="/login" className="text-blue-500 font-medium hover:underline">
                         Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
