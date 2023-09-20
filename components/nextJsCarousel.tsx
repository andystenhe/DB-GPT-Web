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
        // const text = e.currentTarget.innerText;
        const text = e.currentTarget.value
        onSelect(text);
    }
    
    return (
        <div>
            <Carousel autoPlay={false} infiniteLoop={true} showThumbs={false} showStatus={false}>
            <div className='control-div'>     
                   <Button className='button-tip' variant="outlined" onClick={getText} value='你是谁' >你是谁</Button>
                   <Button className='button-tip' variant="outlined" onClick={getText} value='你能做什么' >你能做什么</Button>        
                   <Button className='button-tip' variant="outlined" onClick={getText} value='今天是几号' >今天是几号</Button>           
                   <Button className='button-tip' variant="outlined" onClick={getText} value='8楼的设备总数' >8楼的设备总数</Button>                   
                   <Button className='button-tip' variant="outlined" onClick={getText} value='崇文有多少开关插座' >崇文有多少开关插座</Button>
                </div>        
                <div className='control-div'>                                    
                   <Button className='button-tip' variant="outlined" onClick={getText}  value='最近一周崇文的能耗趋势' >1.最近一周崇文的能耗趋势</Button>
                   <Button className='button-tip' variant="outlined" onClick={getText}  value='最近一周累计能耗最高的设备信息' >2.最近一周累计能耗最高的设备信息</Button>                   
                   <Button className='button-tip' variant="outlined" onClick={getText}  value='分析一下设备的能耗' >3.分析一下设备的能耗</Button>                   
                   <Button className='button-tip' variant="outlined" onClick={getText}  value='给一下设备的自动化建议' >4.给一下设备的自动化建议</Button>                   
                   <Button className='button-tip' variant="outlined" onClick={getText}  value='给一个能耗的分析报告' >5.给一个能耗的分析报告</Button>
                </div>     
            </Carousel>
        </div>

    );
};

export default NextJsCarousel;



