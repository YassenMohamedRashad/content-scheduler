import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PlatformsSkelton from '@/components/ui/PlatformsSkelton'; // optional if you want platform loader

const SkeletonLine = ( { height = 'h-4', width = 'w-full' } ) => (
    <div className={ `bg-gray-200 animate-pulse rounded ${ height } ${ width }` }></div>
);

const CreatePostSkeleton: React.FC = () =>
{
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 justify-between">
                <div className="space-y-2">
                    <SkeletonLine width="w-48" height="h-6" />
                    <SkeletonLine width="w-64" height="h-4" />
                </div>
                <Button variant="outline" disabled className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-transparent">Back to Posts</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <SkeletonLine width="w-40" height="h-5" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <SkeletonLine width="w-24" />
                                <SkeletonLine width="w-full" height="h-10" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <SkeletonLine width="w-24" />
                                    <SkeletonLine width="w-20" />
                                </div>
                                <SkeletonLine width="w-full" height="h-32" />
                            </div>

                            <div className="space-y-2">
                                <SkeletonLine width="w-36" />
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 bg-gray-200 animate-pulse rounded" />
                                    </div>
                                    <SkeletonLine width="w-32" className="mx-auto mt-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <SkeletonLine width="w-48" height="h-5" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <SkeletonLine width="w-full" height="h-10" />
                            <SkeletonLine width="w-full" height="h-10" />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <SkeletonLine width="w-32" height="h-5" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Simulate 3 platform skeletons */ }
                            <PlatformsSkelton count={ 3 } />
                        </CardContent>
                    </Card>

                    <Button disabled className="w-full">
                        <SkeletonLine width="w-full" height="h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostSkeleton;
