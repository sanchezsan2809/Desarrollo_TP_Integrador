import { Swiper, SwiperSlide } from 'swiper/react'
import { Link } from 'react-router-dom'
import {
    Navigation,
    Pagination,
    Autoplay
} from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import './HeroCarousel.css'

export default function HeroCarousel() {
    return (
        <Swiper
            modules={[
                Navigation,
                Pagination,
                Autoplay
            ]}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false
            }}
            navigation
            pagination={{
                clickable: true
            }}
            slidesPerView={1}
            slidesPerGroup={1}
            loop={false}
            rewind={true}
            observer={true}
            observeParents={true}
            watchOverflow={true}
            className="hero-swiper"
        >
            <SwiperSlide>
                <div className="hero-slide">
                    <h1>
                        Programá tus turnos online
                    </h1>

                    <p>
                        Encontrá especialistas y reservá en minutos
                    </p>

                    <Link
                        to="/busquedaDeTurnos"
                        className="boton-verMas"
                    >
                        Reservar ahora
                    </Link>
                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className="hero-slide">
                    <h1>
                        Campaña de Vacunación
                    </h1>

                    <p>
                        Consultá centros y disponibilidad
                    </p>

                    <Link
                        to="/servicios"
                        className="boton-verMas"
                    >
                        Ver más
                    </Link>
                </div>
            </SwiperSlide>
        </Swiper>
    )
}