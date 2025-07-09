import { useParams } from 'next/navigation';
import React from 'react';

const page = ({params}:{params:string}) => {
    console.log(params.group,'grp')
    // const params = useParams()
    // console.log(params,'param')
    return (
        <div>
            
        </div>
    );
};

export default page;