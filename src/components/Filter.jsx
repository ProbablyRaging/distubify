import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuState, darkMode } from './Navbar';
import { getFilteredResults } from '../constants/utils';
import { fetchVideoData } from './Videos';

const Filter = () => {
    const filters = [
        {
            id: 'newest',
            title: 'Newest',
        },
        {
            id: 'oldest',
            title: 'Oldest',
        }
    ]

    const navigate = useNavigate();
    const location = useLocation();

    const inlineFilterClick = (value) => {
        const params = new URLSearchParams();
        params.append('filter', value);
        navigate({
            pathname: location.pathname,
            search: `${params}`,
        });
    };

    return (
        <div className={`fixed flex items-center flex-row gap-4 top-[64px] ss:ml-[95px] ${menuState.value ? 'ml-[250px]' : 'ml-[95px]'} pb-3 pt-3 ${darkMode.value ? 'bg-bgdark text-textdark' : 'bg-bglight text-textlight'} w-full box-border duration-150`}>
            {filters.map((item, index) => (
                <div
                    key={index}
                    id='sdafasdfasd'
                    className={`text-sm ${location.search.split('?filter=')[1] === item.id ? darkMode.value ? 'bg-white/30 text-textdark' : 'bg-black/30 text-white' : darkMode.value ? 'bg-white/10 text-textdark' : 'bg-black/10 text-textlight'} cursor-pointer w-fit h-fit px-3 py-1 rounded-md ${darkMode.value ? 'hover:bg-white/30' : 'hover:bg-black/30'} duration-150`}
                    onClick={async () => {
                        const newData = await getFilteredResults(item.id);
                        fetchVideoData.value = newData;
                        inlineFilterClick(item.id);
                    }}>
                    {item.title}
                </div>
            ))}
        </div>
    );
};

export default Filter;