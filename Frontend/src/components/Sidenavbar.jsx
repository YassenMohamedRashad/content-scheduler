import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useLocation } from 'react-router-dom';
import { BsFilePost } from "react-icons/bs";
import { IoIosHome } from "react-icons/io";
import { IoShareSocial } from "react-icons/io5";


const Sidebar = () =>
{
    const [ isSidebarOpen, setSidebarOpen ] = useState( true );
    const [ isDropdownOpen, setDropdownOpen ] = useState( true );
    const location = useLocation();
    const navigation = [
        { name: 'Home', href: '/', icon: <IoIosHome /> },
        { name: 'Posts', href: '/posts', icon: <BsFilePost /> },
        { name: 'Platforms', href: '/platforms', icon: <IoShareSocial /> },
    ]

    return (
        <>
            {/* Toggle Button */ }
            <div className="bg-white text-gray900 top-0 left-0 z-50 p-2 w-screen shadow">
                <span
                    className="text-4xl cursor-pointer"
                    onClick={ () => setSidebarOpen( !isSidebarOpen ) }
                >
                    <i className="bi bi-filter-left px-2"></i>
                </span>
            </div>
            {
                isSidebarOpen && (
                    <div className="lg:hidden right-0 top-0 fixed w-screen h-screen" onClick={ () => setSidebarOpen( false ) }></div>
                )
            }

            {/* Sidebar */ }
            <div
                className={ `sidebar fixed top-0 bottom-0 z-50 p-2 md:w-[300px] overflow-y-auto text-center bg-neutral100 text-gray900 shadow shadow-primary h-screen duration-1000 ${ isSidebarOpen ? "left-0" : "left-[-300px]"
                    }` }
            >
                
                <div className="text-xl">
                    {/* Header */ }
                    <div className="p-2.5 mt-1 text-center rounded-md">
                        <Link to={ "/" }>
                            <Logo />
                        </Link>
                    </div>

                    <hr className="my-2 border-gray-300" />

                    

                    {/* Menu Items */ }
                    <div className="space-y-2 mt-4">
                        { navigation.map( ( item ) =>
                        {
                            const isCurrent = location.pathname === item.href;
                            return (
                            
                                <Link
                                    to={ item.href }
                                    key={ item.name }
                                    className=
                                    { isCurrent ?
                                        ( "p-2.5 bg-primary flex items-center rounded-md px-4 duration-300 hover:text-neutral100 text-neutral100" ) :
                                        ( "p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:text-primary" )
                                    }
                                >
                                    {item.icon}
                                    <span className="text-[15px] ml-4">{ item.name }</span>
                                </Link>
                            );
                        } ) } 

                        {/* Dropdown */ }
                        <div
                            className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:text-primary"
                            onClick={ () => setDropdownOpen( !isDropdownOpen ) }
                        >
                            <i className="bi bi-chat-left-text-fill"></i>
                            <div className="flex justify-between w-full items-center">
                                <span className="text-[15px] ml-4">Chatbox</span>
                                <span
                                    className={ `text-sm transform duration-300 ${ isDropdownOpen ? "rotate-180" : "rotate-0"
                                        }` }
                                >
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                        </div>

                        { isDropdownOpen && (
                            <div className="leading-7 text-left text-sm font-thin mt-2 w-4/5 mx-auto">
                                { [ "Social", "Personal", "Friends" ].map( ( item ) => (
                                    <h1
                                        key={ item }
                                        className="cursor-pointer p-2 hover:text-neutral100 text-gray-700 rounded-md mt-1"
                                    >
                                        { item }
                                    </h1>
                                ) ) }
                            </div>
                        ) }

                        {/* Logout */ }
                        <div className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:text-primary mt-3">
                            <i className="bi bi-box-arrow-in-right"></i>
                            <span className="text-[15px] ml-4">Logout</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                content
            </div>
        </>
    );
};

export default Sidebar;
