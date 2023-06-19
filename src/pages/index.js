import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const Index = () =>{
    const router = useRouter();
    const GoAdmin = () => {
        router.replace('/admin');
    }
    
    return(
        <>
            <div>
                <GoAdmin/>
            </div>
        </>
    )
}

export default Index;