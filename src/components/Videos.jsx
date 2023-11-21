import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVideoList } from '../constants/utils';
import { Spinner } from '@nextui-org/react';
import { formatDistanceToNow, set } from 'date-fns';
import { SiYoutube, SiTwitch } from "@icons-pack/react-simple-icons";
import { signal } from '@preact/signals-react';
import { menuState, darkMode } from './Navbar';
import Loader from './partials/Loader';

export const fetchVideoData = signal();
const isInitialFetchFinished = signal(false);
const isFetching = signal(false);

const RelativeTime = ({ date }) => {
    const formattedDate = formatDistanceToNow(new Date(date), { addSuffix: true });
    return (
        <span>
            {formattedDate.replace('about ', '').replace('less than ', '')}
        </span>
    );
};

const Videos = () => {
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getVideoList(1);
            fetchVideoData.value = data;
            isInitialFetchFinished.value = true;
        };
        fetchData();
    }, []);

    const fetchNextPage = async () => {
        if (isFetching.value) return;
        isFetching.value = true;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        try {
            const nextPageData = await getVideoList(page + 1);
            if (nextPageData && nextPageData?.length > 0) {
                setTimeout(() => {
                    fetchVideoData.value = [...fetchVideoData.value, ...nextPageData];
                    setPage((prevPage) => prevPage + 1);
                    isFetching.value = false;
                }, 2000);
            }
        } catch (error) {
            console.error('Error fetching next page:', error);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [page]);

    const handleScroll = () => {
        if (document.documentElement.scrollHeight - window.innerHeight - 100 <= window.scrollY) {
            fetchNextPage();
        }
    };

    return (
        <div className={`flex flex-col justify-center items-center overflow-y-visible mt-[84px] ss:ml-[95px] ${menuState.value ? 'ml-[250px] pr-4' : 'ml-[95px] pr-6'} duration-150`}>

            {isInitialFetchFinished.value ? (
                <div className='flex ss:block flex-row w-full gap-10 pt-[52px] box-border overflow-hidden'>
                    <div className={`flex ss:block flex-row flex-wrap flex-grow gap-4 gap-y-10 box-border pl-1`}>
                        {fetchVideoData.value ? (
                            <React.Fragment>
                                {fetchVideoData.value.map((item, index) => (
                                    <Link key={index} to={item.platform === 'youtube' ? `/v/${item.videoId}` : item.url} target={item.platform === 'twitch' ? '_blank' : ''}>
                                        <div className={`flex flex-col ${menuState.value ? 'w-[314px]' : 'w-[344px]'} ss:w-full ss:mb-10 hover:scale-[1.02] duration-150`}>
                                            <img className='rounded-lg min-h-[176.63px] max-h-[176.63px] ss:min-h-full ss:max-h-full' src={item.thumbnail} alt={item.title} width={'100%'} />
                                            <div>
                                                <p className='font-semibold my-2 whitespace-nowrap overflow-hidden overflow-ellipsis'>{item.title}</p>
                                                <div className='flex items-center gap-2 text-sm font-normal'>
                                                    <p className='m-0 whitespace-nowrap overflow-hidden overflow-ellipsis'>{item.channel}</p>
                                                    {item.platform === 'youtube' ? (
                                                        <SiYoutube className='w-4 text-youtube' />
                                                    ) : (
                                                        <SiTwitch className='w-4 text-twitch' />
                                                    )}
                                                </div>
                                                <div className={`flex items-center gap-1 ${darkMode.value ? 'text-white/60' : 'text-black/60'}`}>
                                                    <p className='text-sm font-normal m-0 whitespace-nowrap overflow-hidden overflow-ellipsis'>{item.views} views</p>
                                                    <span className='text-xs'>•</span>
                                                    <p className='text-sm font-normal m-0 whitespace-nowrap overflow-hidden overflow-ellipsis'>{<RelativeTime date={item.dateAdded} />}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </React.Fragment>
                        ) : (
                            <div className='flex place-content-center w-full h-full'>
                                <span>There are no videos yet. Add your own video to see it here.</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Loader />
            )}

            {isLoading && (
                <div className='my-16'>
                    <Spinner color={darkMode.value ? 'white' : 'black'} size='large' />
                </div>
            )}
        </div>
    );
};

export default Videos;