import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const SignUp = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data)
            if (res.data.success) {
                navigate("/login")
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: "",
                })
            }
        } catch (error) {
            console.log("🚀 ~ signupHandler ~ error:", error)
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} action="" className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>SignUp to see photos & videos from your friends</p>
                </div>
                <div>
                    <Label className='font-medium'>Username:</Label>
                    <Input
                        type="text"
                        name="username"
                        className="my-2"
                        value={input.username}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label className='font-medium'>Email:</Label>
                    <Input
                        type="email"
                        name="email"
                        className="my-2"
                        value={input.email}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label className='font-medium'>Password:</Label>
                    <Input
                        type="password"
                        name="password"
                        className="my-2"
                        value={input.password}
                        onChange={changeEventHandler}
                    />
                </div>
                {
                    loading ? (
                        <Button><Loader2 className='mr-2 h-4 w-4 animate-spin' /></Button>
                    ) : (
                        <Button type='submit'>Signup</Button>
                    )
                }
                <span className='text-center'>Already have an account? <Link to='/login' className='text-blue-600'>Login</Link></span>
            </form>
        </div>
    )
}

export default SignUp