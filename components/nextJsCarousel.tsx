"use client";
import React, { BaseSyntheticEvent, Component } from 'react';
import { Button} from '@/lib/mui';

import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Carousel } from 'react-responsive-carousel';
import "./nextJsCarousel.css";

interface CarouselProps {
    onSelect: (text: string) => void; 
};

const NextJsCarousel: React.FC<CarouselProps> = ({ onSelect }) => {

    const getText = (e: BaseSyntheticEvent) => {
        const text = e.currentTarget.innerText;;
        onSelect(text);
    }
    
    return (
        <div>
            <Carousel autoPlay={false} infiniteLoop={true} showThumbs={false} showStatus={false}>
                <div className='control-div'>                                    
                   <Button className='button-tip' variant="outlined" onClick={getText}>给一个能耗的分析报告</Button>
                   <Button className='button-tip' variant="outlined" onClick={getText}>最近一周崇文的能耗趋势</Button>
                   <Button className='button-tip' variant="outlined" onClick={getText}>最近一周能耗最高的设备信息</Button>                   
                   <Button className='button-tip' variant="outlined" onClick={getText}>分析一下设备的能耗</Button>                   
                   <Button className='button-tip' variant="outlined" onClick={getText}>给一下设备的自动化建议</Button>
                </div>
                <div className='control-div'>     
                   <Button className='button-tip' variant="outlined" onClick={getText}>你是谁</Button>
                   <Button className='button-tip' variant="outlined" onClick={getText}>你能做什么</Button>        
                   <Button className='button-tip' variant="outlined" onClick={getText}>今天是几号</Button>           
                   <Button className='button-tip' variant="outlined" onClick={getText}>8楼的设备总数</Button>                   
                   <Button className='button-tip' variant="outlined" onClick={getText}>崇文有多少开关插座</Button>
                </div>               
               
            </Carousel>
        </div>

    );
};

export default NextJsCarousel;



