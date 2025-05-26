import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
function PlatformsSkelton ()
{
    return (
        <>
            { Array.from( { length: 5 } ).map( ( _, idx ) => (
                <div className="flex items-center space-x-2 bg-gray-200 p-3 rounded animate-pulse ">
                    <div className='animate-pulse' />
                    <Label>
                        <span className='ms-4'></span>
                    </Label>
                </div>
            ) ) }
        </>
    );
}

export default PlatformsSkelton;