import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

function PostsSkelton ()
{
    return (
        <div className='grid grid-cols-2 gap-5'>
            { Array.from( { length: 5 } ).map( ( _, idx ) => (
                <Card key={ idx }>
                    <CardHeader>
                        <div className="w-full h-48 bg-gray-200 animate-pulse rounded-md mb-4" />
                        <div className="space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                            <div className="flex gap-2">
                                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded" />
                                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2" />
                        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded mb-4" />
                        <div className="flex justify-between">
                            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
                            <div className="h-3 w-32 bg-gray-200 animate-pulse rounded" />
                        </div>
                    </CardContent>
                </Card>
            ) ) }
        </div>
    );
}

export default PostsSkelton

