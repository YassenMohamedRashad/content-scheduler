import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const platformPageSkelton = () =>
{
    return (
        <div className="space-y-6">
            {/* Header Skeleton */ }
            <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-96 mt-2" />
            </div>

            {/* Platform Cards Skeleton */ }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                { [ ...Array( 3 ) ].map( ( _, i ) => (
                    <Card key={ i } className="relative pb-20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-6 w-32" />
                                </div>
                                <Skeleton className="h-6 w-10 rounded-full" />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                { [ ...Array( 1 ) ].map( ( _, j ) => (
                                    <div key={ j }>
                                        <Skeleton className="h-6 w-12 mx-auto" />
                                        <Skeleton className="h-3 w-16 mx-auto mt-1" />
                                    </div>
                                ) ) }
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                ) ) }
            </div>

            {/* Summary Card Skeleton */ }
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        { [ ...Array( 4 ) ].map( ( _, i ) => (
                            <div key={ i }>
                                <Skeleton className="h-8 w-12 mx-auto" />
                                <Skeleton className="h-3 w-20 mx-auto mt-1" />
                            </div>
                        ) ) }
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default platformPageSkelton;
