import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }
    }

    const sendMessageHandler = async () => {
        alert(text);
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img
                            src="https://images.unsplash.com/photo-1742506261388-4f5a6857d6c4?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="post_img"
                            className='w-full h-full object-cover rounded-l-lg'
                        />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between bg-white'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src="" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs'>username</Link>
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className='bg-white'>
                                    <div className='cursor-pointer w-full text-[#ED4956]'>
                                        Unfollow
                                    </div>
                                    <div className='cursor-pointer w-full'>
                                        Add to Favorite
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            Comments...
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a Comment...' className='w-full outline-none border border-gray-300 p-1' />
                                <Button disabled={!text} onClick={sendMessageHandler} variant="outline">Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog