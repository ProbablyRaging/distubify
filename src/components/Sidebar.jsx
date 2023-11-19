import React, { useEffect } from 'react';
import { getChannelList, getChannelVideos } from '../constants/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SiDiscord, SiYoutube, SiTwitch } from "@icons-pack/react-simple-icons";
import HomeIcon from '@mui/icons-material/Home';
import { signal } from '@preact/signals-react';
import { getFilteredResults } from '../constants/utils';
import { fetchVideoData } from './Videos';
import { menuState, darkMode } from './Navbar';

export const fetchChannelData = signal();

const NavBar = () => {
    useEffect(() => {
        const fetchData = async () => {
            const data = await getChannelList();
            fetchChannelData.value = data;
        };
        fetchData();
    }, []);

    const menuItems = [
        {
            id: 'all',
            title: 'Home',
            icon: <HomeIcon className='min-w-[24px]' />
        },
        {
            id: 'youtube',
            title: 'YouTube Videos',
            icon: <SiYoutube className='w-[22px] min-w-[22px]' />
        },
        {
            id: 'twitch',
            title: 'Twitch Videos',
            icon: <SiTwitch className='w-[22px] min-w-[22px]' />
        }
    ];

    const navigate = useNavigate();
    const location = useLocation();

    const appendParams = (value) => {
        const params = new URLSearchParams();
        params.append('filter', value);
        navigate({
            pathname: location.pathname,
            search: `${params}`,
        });
    };

    const filterByPlatform = async (value) => {
        if (value === 'all') return navigate('/');
        const newVideoData = await getFilteredResults(value);
        fetchVideoData.value = newVideoData;
        appendParams(value);
    };

    const filterByChannel = async (value) => {
        const newVideoData = await getChannelVideos(value);
        fetchVideoData.value = newVideoData;
        appendParams(value);
    };

    return (
        <div className={`fixed flex flex-col justify-between right-auto ss:w-[95px] ${menuState.value ? 'w-[250px]' : 'w-[95px]'} ${darkMode.value ? 'text-white/90' : 'text-black/90'} top-[74px] h-full left-0 overflow-auto text-sm font-medium duration-150`}>
            <div className='flex flex-col px-3 pr-6'>
                {menuItems.map((item, index) => (
                    <div className={`m-0 py-2 px-[18px] rounded-lg ${location.pathname.replace('/', '') === item.id ? 'bg-gray-200' : ''} ${darkMode.value ? 'hover:bg-white/10' : 'hover:bg-gray-200'} cursor-pointer`} key={index}>
                        <Link
                            className="flex items-center gap-6 w-full"
                            onClick={() => filterByPlatform(item.id)}
                        >
                            {item.icon}
                            <p className='p-0 m-0 whitespace-nowrap overflow-hidden overflow-ellipsis ss:hidden'>
                                {menuState.value ? item.title : ''}
                            </p>
                        </Link>
                    </div>
                ))}

                {menuState.value && (
                    <div className='ss:hidden'>
                        <h2 className={`flex w-full items-center text-base text-gray- font-medium gap-x-3 mb-1`}>
                            Channels
                            <div className="h-[1px] grow bg-gray-500"></div>
                        </h2>

                        {fetchChannelData.value ? (
                            <React.Fragment>
                                {fetchChannelData.value.map((item, index) => (
                                    <div
                                        className={`m-0 py-2 px-[18px] rounded-lg ${darkMode.value ? 'hover:bg-white/10' : 'hover:bg-gray-200'} cursor-pointer`}
                                        key={`${item}-${index}`}
                                        onClick={() => filterByChannel(item.channelId)}
                                    >
                                        <div className='flex items-center gap-6 w-full'>
                                            <img className='rounded-full' src={item.avatar} width='24' alt={item.channelHandle} />
                                            <p className='p-0 m-0 whitespace-nowrap overflow-hidden overflow-ellipsis'>
                                                {item.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ) : (
                            <div className='flex place-content-center w-full h-full'>
                                <span>No channels found</span>
                            </div>
                        )}
                    </div>
                )}

            </div>

            <div className='relative bottom-[74px] text-center p-3'>
                <div className='flex justify-center flex-row flex-wrap gap-4'>
                    <div>
                        <a href='https://discord.com/invite/contentcreator' target='_blank' rel='external noopener noreferrer' className={`${darkMode.value ? 'text-white/60' : 'text-black/40'}`}>
                            <SiDiscord className='w-[20px] h-[20px]' />
                        </a>
                    </div>
                </div>
                <p className={`font-normal text-center text-[10px] leading-[18px] ${darkMode.value ? 'text-white/40' : 'text-gray-500'} m-0 duration-150`}>
                    {menuState.value ? '© 2023 Distubify' : '© Distubify'}
                </p>
            </div>
        </div>
    );
};

export default NavBar;