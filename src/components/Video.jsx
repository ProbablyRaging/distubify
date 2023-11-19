import React, { lazy, Suspense, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../components';
import { getVideoData, getChannelData, getVideoComments, newCommentSubmission } from '../constants/utils';
import YouTube from 'react-youtube';
import { Button, Input, Spinner } from '@nextui-org/react';
import { darkMode, userSession } from '../components/Navbar';
import { Link } from 'react-router-dom';

const Content = lazy(() => import('../components/partials/Content'));
const NavBar = lazy(() => import('../components/Navbar'));

const Landing = () => {
    const { id } = useParams();
    const [isPlayerReady, setIsPlayerReady] = useState(0);
    const [videoId, setVideoId] = useState(id);
    const [videoData, setVideoData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const playerRef = useRef(null);
    const commentInput = useRef(null);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchVideoData = async () => {
            const data = await getVideoData(videoId);
            setVideoData(data);
        };
        fetchVideoData();
    }, [videoId]);

    useEffect(() => {
        const fetchChannelData = async () => {
            if (videoData) {
                const data = await getChannelData(videoData.channelId);
                setChannelData(data);
            }
        };
        fetchChannelData();
    }, [videoData]);

    useEffect(() => {
        const fetchCommentData = async () => {
            const data = await getVideoComments(videoId);
            setCommentData(data);
        };
        fetchCommentData();
    }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleCommentSubmit = async () => {
        setIsLoading(true);
        const response = await newCommentSubmission(inputValue, videoId);
        if (response.message) {
            setTimeout(async () => {
                const updatedCommentList = await getVideoComments(videoId);
                setCommentData(updatedCommentList);
                setIsLoading(false);
            }, 500);
            setInputValue('');
            commentInput.current.focus();
        }
    }

    const aspectRatioHeight = ((windowWidth * 9) / 16) - 20;

    const opts = {
        width: windowWidth <= 1024 ? '100%' : '1271',
        height: windowWidth <= 1024 ? aspectRatioHeight : '714',
        playerVars: {
            playsinline: 1,
        },
    };

    const onReady = (event) => {
        event.target.playVideo();
        setIsPlayerReady((int) => int = 1);
    };

    const onStateChange = (event) => {
        if (event.data === 1 && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
    };

    const stopVideo = () => {
        playerRef.current.internalPlayer.stopVideo();
    };

    let done = false;

    return (
        <Suspense fallback={<Loader />}>
            <Content>
                <React.Fragment>
                    <NavBar />
                    {/* <Sidebar /> */}
                    {channelData && (
                        <div className={`flex flex-col overflow-y-visible mt-[84px] mx-6 ss:mb-8 duration-150 box-border`}>
                            <div className='flex flex-row md:flex-col gap-8'>
                                <div className={`rounded-xl h-[714px] w-[1271px] md:w-full md:h-full overflow-hidden z-10 duration-150`}>
                                    <YouTube
                                        className={`${isPlayerReady >= 1 ? 'block' : 'hidden'}`}
                                        videoId={videoId}
                                        opts={opts}
                                        onReady={onReady}
                                        onStateChange={onStateChange}
                                        ref={playerRef}
                                    />
                                </div>

                                <div className='flex flex-col grow'>
                                    <p className='m-0 text-lg font-semibold mb-2'>{commentData.data.comments.length} Comments</p>
                                    <div className={`w-full h-full ${darkMode.value ? 'bg-white/5' : 'bg-black/5'} rounded-2xl p-2 box-border max-w-[470px] ss:max-w-full flex flex-col`}>
                                        <div className='flex flex-col gap-2 max-h-[500px] overflow-y-auto p-3'>

                                            {commentData.data.comments.length > 0 ? (
                                                <React.Fragment>
                                                    {commentData.data.comments.map((item, index) => (
                                                        <div key={index} className={`flex flex-row items-center gap-2 w-full ${darkMode.value ? 'bg-white/10' : 'bg-black/10'} p-3 box-border rounded-md`}>
                                                            <img className='rounded-full mb-auto' src={`https://cdn.discordapp.com/avatars/${item.userId}/${item.avatar}.webp?size=80`} alt={item.username} width='32px' />
                                                            <div className='flex flex-col'>
                                                                <p className='m-0 text-sm font-semibold'>{item.username}</p>
                                                                <p className='m-0 text-sm break-words'>{item.comment}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <p className={`${darkMode.value ? 'text-white/30' : 'text-black/30'}`}>There are no comments, yet..</p>
                                                </React.Fragment>
                                            )}
                                        </div>

                                        <div className='flex flex-row mt-auto gap-4'>
                                            <Input
                                                value={inputValue}
                                                ref={commentInput}
                                                onChange={handleInputChange}
                                                isDisabled={userSession.value?.data ? false : true}
                                                type="text"
                                                placeholder={userSession.value?.data ? 'Add a comment...' : 'Sign in to comment'}
                                                classNames={{
                                                    input: [`${darkMode.value ? 'bg-[#121212] text-textdark border-[#232222]' : 'bg-[#d7d7d7] text-textlight border-[#d7d7d7]'}`, 'rounded-lg', 'pl-3', 'border-solid', 'border-[1px]', 'focus:border-solid', 'focus:border-[1px]', 'focus:border-blue-500'],
                                                    inputWrapper: ['m-0', 'p-0', 'border-none', 'rounded-lg'],
                                                }}
                                            />
                                            <Button isDisabled={userSession.value?.data ? false : true} className='bg-button text-white' isLoading={isLoading} onPress={handleCommentSubmit}>Comment</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col'>
                                <p className='text-xl font-semibold'>{videoData.title}</p>
                                <div className='flex flex-row ssup:items-center gap-3'>
                                    <a href={channelData.url} target='_blank'>
                                        <img className='rounded-full' src={channelData.avatar} alt={channelData.name} width='48px' />
                                    </a>
                                    <div className='flex flex-row gap-8 flex-wrap'>
                                        <div className='flex flex-col'>
                                            <a href={channelData.url} target='_blank'>
                                                <p className='m-0'>{videoData.channel}</p>
                                            </a>
                                            <p className='m-0 text-xs'>{channelData.subscriberCount} subscribers</p>
                                        </div>
                                        <div className='flex flex-row gap-2 flex-wrap'>
                                            <Link to={`https://www.youtube.com/${channelData.handle}?sub_confirmation=1`} target='_blank'>
                                                <Button className='bg-youtube text-white'>Subscribe</Button>
                                            </Link>
                                            <Link to={videoData.url} target='_blank'>
                                                <Button className='bg-gray-600 text-white'>Watch On YouTube</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </React.Fragment>
            </Content>
        </Suspense >
    );
};

export default Landing;