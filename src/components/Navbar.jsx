import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Input, Modal, ModalContent, ModalBody, ModalFooter, useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { SiDedge } from "@icons-pack/react-simple-icons";
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SiYoutube, SiTwitch } from "@icons-pack/react-simple-icons";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { validateSession, checkForToken, newVideoSubmission, getVideoList, getSearchResults, getSearchHistory, logUserOut } from '../constants/utils';
import { fetchVideoData } from './Videos';
import { effect, signal } from '@preact/signals-react';

export const darkMode = signal();
export const menuState = signal(true);
export const userSession = signal();

effect(() => {
    const menuStateInit = localStorage.getItem('menuState');
    if (menuStateInit === 'true') {
        return menuState.value = true;
    } else {
        return menuState.value = false;
    }
});

effect(() => {
    const darkModeInit = localStorage.getItem('theme');
    if (darkModeInit === 'true') {
        return darkMode.value = true;
    } else {
        return darkMode.value = false;
    }
});

const NavBar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalPlatform, setModalPlatform] = useState('');
    const [inputFocused, setInputFocused] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const searchInput = useRef(null);
    const youtubeInput = useRef(null);
    const twitchInput = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = await checkForToken();
            if (token) {
                userSession.value = token;
                navigate({ pathname: location.pathname });
                return;
            }
            const data = await validateSession();
            userSession.value = data;
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchTheme = async () => {
            const themeState = localStorage.getItem('theme');
            if (!themeState) {
                localStorage.setItem('theme', false);
            } else {
                darkMode.value = JSON.parse(themeState);
            }
        };
        fetchTheme();
    }, []);

    const toggleTheme = () => {
        darkMode.value = !darkMode.value
        localStorage.setItem('theme', darkMode.value);
    };

    const toggleMenuState = () => {
        menuState.value = !menuState.value;
        localStorage.setItem('menuState', menuState.value);
    };

    const handleOpen = async (platform) => {
        setModalPlatform(platform);
        await onOpen();
        if (platform === 'youtube') youtubeInput.current.focus();
        if (platform === 'twitch') twitchInput.current.focus();
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleVideoSubmit = async (platform) => {
        setIsLoading(true);
        const response = await newVideoSubmission(platform, inputValue);
        if (response.message) {
            setStatusText(response.message);
            setIsSuccess(true);
            setTimeout(async () => {
                const updatedVideoList = await getVideoList();
                fetchVideoData.value = updatedVideoList;
            }, 500);
            setInputValue('');
            if (platform === 'youtube') youtubeInput.current.focus();
            if (platform === 'twitch') twitchInput.current.focus();
            setTimeout(() => {
                setStatusText('');
            }, 7000);
        } else {
            setStatusText(response.error);
            setIsSuccess(false);
            setTimeout(() => {
                setStatusText('');
            }, 7000);
        }
        setIsLoading(false);
    }

    const appendParams = (value) => {
        const params = new URLSearchParams();
        params.append('query', value);
        navigate({
            pathname: location.pathname,
            search: `${params}`,
        });
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            const newVideoData = await getSearchResults(event.target.value);
            fetchVideoData.value = newVideoData;
            appendParams(event.target.value);
            searchInput.current.blur();
        }
    };

    const handleSearchHistoryClick = async (value) => {
        console.log('boop');
        const newVideoData = await getSearchResults(value);
        fetchVideoData.value = newVideoData;
        appendParams(value);
        searchInput.current.blur();
    };

    const handleInputFocus = async () => {
        const searchHistoryData = await getSearchHistory();
        setSearchHistory(searchHistoryData);
        setInputFocused(true);
    };

    const handleInputBlur = () => {
        setInputFocused(false);
    };

    const handleLogout = async () => {
        await logUserOut();
    };

    return (
        <React.Fragment>
            <Navbar className={`fixed ${darkMode.value ? 'bg-bgdark text-textdark' : 'bg-bglight text-textlight'} duration-150`} maxWidth="full">
                <NavbarContent className="m-0 p-0">
                    <div className={`flex place-content-center rounded-lg p-1 w-[28px] ${darkMode.value ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} cursor-pointer duration-150 ss:hidden ssup:visible`} onClick={toggleMenuState}>
                        {menuState.value ? <SiDedge title='' className='w-[18px]' /> : <ArrowForwardIosIcon title='' className='w-[18px]' />}
                    </div>
                    <div className={`flex place-content-center rounded-lg p-1 w-[28px] ${darkMode.value ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} cursor-pointer duration-150 ss:visible ssup:hidden`}>
                        <Link className='flex place-content-center' to={'/'}>
                            <SiDedge title='' className='w-[18px]' />
                        </Link>
                    </div>
                    <NavbarBrand className='ss:hidden'>
                        <Link to={`/`}>
                            <p className="font-bold text-[20px] text-inherit leading-[0] select-none">Distubify</p>
                        </Link>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="m-0">
                    <Input
                        className='ss:hidden'
                        classNames={{
                            input: [`${darkMode.value ? 'bg-[#121212] text-textdark border-[#232222]' : 'bg-[#ededed] text-textlight border-[#ededed]'}`, 'rounded-l-[999px]', 'pl-3', 'border-solid', 'border-[1px]', 'focus:border-solid', 'focus:border-[1px]', 'focus:border-blue-500'],
                            inputWrapper: ['ml-0', 'pl-0', `${darkMode.value ? 'bg-[#232222] data-[hover=true]:bg-[#232222] group-data-[focus=true]:bg-[#232222] border-[#232222]' : 'bg-[#e5e5e5] data-[hover=true]:bg-[#e5e5e5] group-data-[focus=true]:bg-[#e5e5e5] border-[#d7d7d7]'}`, 'border-solid', 'border-[1px]', 'rounded-l-[999px]', 'rounded-r-[999px]'],
                        }}
                        ref={searchInput}
                        type="search"
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onKeyUp={handleKeyPress}
                        placeholder="Search"
                        endContent={<SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                    />
                </NavbarContent>

                <NavbarContent className="m-0" justify="end">
                    <div className={`flex flex-col gap-2 p-1 rounded-lg ${darkMode.value ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} cursor-pointer duration-150`} onClick={toggleTheme}>
                        {darkMode.value ? <LightModeIcon /> : <DarkModeIcon />}
                    </div>

                    {userSession.value?.data ? (
                        <div className='flex items-center gap-5'>
                            <NavbarItem className='flex items-center ss:hidden ssup:visible'>
                                <Dropdown className={`${darkMode.value ? 'bg-[#282828] text-textdark' : 'bg-bglight text-textlight'}`}>
                                    <DropdownTrigger>
                                        <Button className='bg-button text-white hover:bg-button/90' variant="solid" startContent={<CloudUploadOutlinedIcon />}>
                                            Add Link
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu className='m-0 p-0' aria-label="Static Actions">
                                        <DropdownItem key="yt-video" startContent={<SiYoutube />} onPress={() => { handleOpen('youtube') }}>YouTube Video</DropdownItem>
                                        <DropdownItem key="tw-vod" startContent={<SiTwitch />} onPress={() => { handleOpen('twitch') }}>Twitch Video</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </NavbarItem>

                            <NavbarItem className='flex items-center ss:visible ssup:hidden'>
                                <Dropdown className={`${darkMode.value ? 'bg-[#282828] text-textdark' : 'bg-bglight text-textlight'}`}>
                                    <DropdownTrigger>
                                        <Button isIconOnly={true} className='bg-button text-white hover:bg-button/90' variant="solid" startContent={<CloudUploadOutlinedIcon />}></Button>
                                    </DropdownTrigger>
                                    <DropdownMenu className='m-0 p-0' aria-label="Static Actions">
                                        <DropdownItem key="yt-video" startContent={<SiYoutube />} onPress={() => { handleOpen('youtube') }}>YouTube Video</DropdownItem>
                                        <DropdownItem key="tw-vod" startContent={<SiTwitch />} onPress={() => { handleOpen('twitch') }}>Twitch Video</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </NavbarItem>

                            <NavbarItem className='flex items-center'>
                                <Dropdown className={`${darkMode.value ? 'bg-[#282828] text-textdark' : 'bg-bglight text-textlight'}`}>
                                    <DropdownTrigger>
                                        <img className='rounded-full hover:cursor-pointer' src={`https://cdn.discordapp.com/avatars/${userSession.value.data.userId}/${userSession.value.data.avatar}.webp?size=256`} width='35' onError={(e) => { e.target.src = '../assets/images/default-avatar.png'; }} alt="" />
                                    </DropdownTrigger>
                                    <DropdownMenu className='m-0 p-0' aria-label="Static Actions">
                                        <DropdownItem key="tw-vod" startContent={<LogoutIcon className='text-red-400' />} onPress={handleLogout}>Logout</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </NavbarItem>
                        </div>
                    ) : (
                        <NavbarItem>
                            <Link to="https://discord.com/api/oauth2/authorize?client_id=977292001718464592&redirect_uri=https://distubify.xyz/auth/redirect&response_type=code&scope=guilds%20identify">
                                <Button color="primary" variant="solid">
                                    Sign In
                                </Button>
                            </Link>
                        </NavbarItem>
                    )}
                </NavbarContent>
            </Navbar >

            {inputFocused && (
                <div className={`absolute left-[35%] top-[60px] rounded-[14px] w-[520px] z-[999] shadow-small p-0 m-0 ${darkMode.value ? 'bg-[#282828] text-textdark' : 'bg-bglight text-textlight'}`}>
                    <div className='mt-2 mb-2'>
                        {searchHistory.slice(0, 10).map((item, index) => (
                            <div className={`m-0 p-0 cursor-pointer`} key={`${item}-${index}`}>
                                <p className={`flex items-center gap-2 m-0 p-1 ${darkMode.value ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
                                    <HistoryIcon className={`${darkMode.value ? 'text-white/20' : 'text-black/30'}`} /> {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {modalPlatform === 'youtube' ? (
                <Modal
                    className={`${darkMode.value ? 'bg-[#282828] text-textdark' : 'bg-bglight text-textlight'}`}
                    classNames={{
                        closeButton: darkMode.value ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
                    }}
                    placement={'center'}
                    size='lg'
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalContent>
                        <ModalBody className={`m-6 mb-0`}>
                            <Input
                                classNames={{
                                    input: [`${darkMode.value ? 'bg-[#121212] text-textdark border-[#232222]' : 'bg-[#ededed] text-textlight border-[#ededed]'}`, 'rounded-lg', 'pl-3', 'border-solid', 'border-[1px]', 'focus:border-solid', 'focus:border-[1px]', 'focus:border-blue-500'],
                                    inputWrapper: ['m-0', 'p-0', 'border-none', 'rounded-lg'],
                                    label: darkMode.value ? 'bg-[#282828] text-textdark' : 'bg-bglight text-textlight'
                                }}
                                value={inputValue}
                                ref={youtubeInput}
                                type="text"
                                label="Video URL or ID"
                                labelPlacement='outside'
                                placeholder="https://www.youtube.com/watch?v=XE388rpqENQ"
                                onChange={handleInputChange} />
                            {isSuccess ? (
                                <p className='p-0 m-0 text-xs text-green-600'>{statusText}</p>
                            ) : (
                                <p className='p-0 m-0 text-xs text-red-400'>{statusText}</p>
                            )}
                        </ModalBody>
                        <ModalFooter className='mr-5'>
                            <div className='flex justify-center items-center'>
                                <Button color='secondary' className='w-[45px]' isLoading={isLoading} onPress={() => { handleVideoSubmit('youtube') }}>
                                    {isLoading ? '' : 'Submit'}
                                </Button>
                            </div>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            ) : (
                <Modal
                    className={`${darkMode.value ? 'bg-[#282828] text-textdark' : 'bg-bglight text-textlight'}`}
                    classNames={{
                        closeButton: darkMode.value ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
                    }}
                    placement={'center'}
                    size='lg'
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalContent>
                        <ModalBody className='m-6 mb-0'>
                            <Input
                                classNames={{
                                    input: [`${darkMode.value ? 'bg-[#121212] text-textdark border-[#232222]' : 'bg-[#ededed] text-textlight border-[#ededed]'}`, 'rounded-lg', 'pl-3', 'border-solid', 'border-[1px]', 'focus:border-solid', 'focus:border-[1px]', 'focus:border-blue-500'],
                                    inputWrapper: ['m-0', 'p-0', 'border-none', 'rounded-lg'],
                                    label: darkMode.value ? 'bg-[#282828] text-textdark' : 'bg-bglight text-textlight'
                                }}
                                value={inputValue} ref={twitchInput}
                                type="text" label="Twitch Video URL"
                                labelPlacement='outside'
                                placeholder="https://www.twitch.tv/videos/93659204226"
                                onChange={handleInputChange} />
                            {isSuccess ? (
                                <p className='p-0 m-0 text-xs text-green-600'>{statusText}</p>
                            ) : (
                                <p className='p-0 m-0 text-xs text-red-400'>{statusText}</p>
                            )}
                        </ModalBody>
                        <ModalFooter className='mr-5'>
                            <div className='flex justify-center items-center'>
                                <Button color='secondary' className='w-[45px]' isLoading={isLoading} onPress={() => { handleVideoSubmit('twitch') }}>
                                    {isLoading ? '' : 'Submit'}
                                </Button>
                            </div>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </React.Fragment>
    );
};

export default NavBar;