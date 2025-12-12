'use client';

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import StepIntro from './StepIntro';
import StepFeature from './StepFeature';
import StepKeywords from './StepKeywords';
import StepStart from './StepStart';
import { Swiper as SwiperType } from 'swiper';

export default function OnboardingSlider() {
  const [step, setStep] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="min-h-screen w-full  flex flex-col justify-center">
      <div>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(s) => setStep(s.activeIndex)}
          spaceBetween={40}
          slidesPerView={1}
          className="w-full h-full"
        >
          <SwiperSlide>
            <StepIntro />
          </SwiperSlide>
          <SwiperSlide>
            <StepFeature />
          </SwiperSlide>
          <SwiperSlide>
            <StepKeywords swiperRef={swiperRef} />
          </SwiperSlide>
          <SwiperSlide>
            <StepStart />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="flex items-center justify-center gap-2 py-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              step === i ? 'bg-(--primary) w-4' : 'bg-(--primary-sub) w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
