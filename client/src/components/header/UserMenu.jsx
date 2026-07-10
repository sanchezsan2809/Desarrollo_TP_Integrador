import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './UserMenu.css'

export default function UserMenu({
    isOpen,
    onClose,
    items,
    containerRef
}) {

    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event) => {
            if (
                containerRef?.current &&
                !containerRef.current.contains(event.target)
            ) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose, containerRef])

    if (!isOpen) return null

    return (
        <div className="user-menu" role="menu">
            {items.map((item, index) => {
                if (item.type === 'link') {
                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="user-menu__item"
                            role="menuitem"
                            onClick={() => {
                                item.onClick?.()
                                onClose()
                            }}
                        >
                            {item.label}
                        </Link>
                    )
                }

                return (
                    <button
                        key={item.label}
                        type="button"
                        className={`user-menu__item${
                            item.isLogout ? ' user-menu__item--logout' : ''
                        }`}
                        role="menuitem"
                        onClick={() => {
                            item.onClick?.()
                            onClose()
                        }}
                    >
                        {item.label}
                    </button>
                )
            })}
        </div>
    )
}