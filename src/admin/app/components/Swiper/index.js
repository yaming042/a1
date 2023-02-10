import React, {Component} from 'react';
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import styles from './index.scss';


export default (props) => {
    // [{icon: '', url: '', name: '', description: ''}]
    const {data} = props;
    const list = (data?.logo || '').split(',').filter(Boolean).map(item => {
        return {icon: data.icon, logo: item, name: data.name, description: data.description};
    })

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    };

    return (
        <div className={styles['swiper-component-container']}>
            <Swiper
                className={styles['swiper-component']}
                navigation={true}
                pagination={pagination}
                modules={[Navigation, Pagination]}
            >
                {
                    (list || []).map((item, index) => {

                        return (
                            <SwiperSlide
                                key={index}
                                className={styles['swiper-component-item']}
                            >
                                <img src={item.logo} alt={item.name} />
                            </SwiperSlide>
                        );
                    })
                }
            </Swiper>
        </div>
    );
}