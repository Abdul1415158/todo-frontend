import { createContext , useContext , useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider ({children}){
    const [user, setUser] = useState(()=>{
        const stored = localStorage.getItem('user');
        return stored? JSON.parse(stored) : null;
    })

    const [token, setToken] = useState(()=>localStorage.getItem('token'))

    const login = (userData, authToken)=>{  
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token",authToken);
        setUser(userData);
        setToken(authToken);
    };

    const logout = ()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{user,token,login,logout}}>
        {children}
        </AuthContext.Provider>
    )
};

    export function useAuth (){
        return useContext(AuthContext)
    };