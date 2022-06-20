import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, IonSlides, LoadingController, Platform } from '@ionic/angular';
import { Chart, registerables  } from 'chart.js';
import { AppComponent } from '../app.component';
import { DataService } from '../services/data.service';

Chart.register(...registerables);


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, AfterViewInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('slidesAc') slides: IonSlides;


  backToTop = false;
  titulo = '';
  results = [];
  resultsPendiente = [];
  resultsVisito = [];
  searchTerm = '';
  default= '';
  pagination=1;
  maxElement=15;
  idVendedor='1';
  loadScroll=true;
  fecha = 'ddd';
  asignado = 'activ';
  personali = '';
  load: any;

  public progress = 1;
  public total = 0;
  public visitado = 0;
  diaSemana = [
    { nombre: 'Domingo', valor: 1 },
    { nombre: 'Lunes', valor: 2 },
    { nombre: 'Martes', valor: 3 },
    { nombre: 'Miercoles', valor: 4 },
    { nombre: 'Jueves', valor: 5 },
    { nombre: 'Viernes', valor: 6 },
    { nombre: 'Sabado', valor: 7 },
  ];
  mes = [
    { nombre: 'Enero', valor: 1 },
    { nombre: 'Febrero', valor: 2 },
    { nombre: 'Marzo', valor: 3 },
    { nombre: 'Abril', valor: 4 },
    { nombre: 'Mayo', valor: 5 },
    { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 },
    { nombre: 'Agosto', valor: 8 },
    { nombre: 'Septiembre', valor: 9 },
    { nombre: 'Octubre', valor: 10 },
    { nombre: 'Noviembre', valor: 11 },
    { nombre: 'Diciembre', valor: 12 },
  ];


  doughnutChart: any;

  slidesOptions = {
    initialSlide: 0,
    // slidesPerView: 1.5
  };

  slidesOptions1 = {
    initialSlide: 0,
    slidesPerView: 1,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: false,
  },
  // grabCursor: true,
  // cubeEffect: {
  //   shadow: true,
  //   slideShadows: true,
  //   shadowOffset: 10,
  //   shadowScale: 0.94,
  // },
  // on: {
  //   beforeInit: function() {
  //     const swiper = this;
  //     swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
  //     swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

  //     const overwriteParams = {
  //       slidesPerView: 1,
  //       slidesPerColumn: 1,
  //       slidesPerGroup: 1,
  //       watchSlidesProgress: true,
  //       resistanceRatio: 0,
  //       spaceBetween: 0,
  //       centeredSlides: false,
  //       virtualTranslate: true,
  //     };

  //     this.params = Object.assign(this.params, overwriteParams);
  //     this.originalParams = Object.assign(this.originalParams, overwriteParams);
  //   },
  //   setTranslate: function() {
  //     const swiper = this;
  //     const {
  //       $el, $wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize,
  //     } = swiper;
  //     const params = swiper.params.cubeEffect;
  //     const isHorizontal = swiper.isHorizontal();
  //     const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  //     let wrapperRotate = 0;
  //     let $cubeShadowEl;
  //     if (params.shadow) {
  //       if (isHorizontal) {
  //         $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
  //         if ($cubeShadowEl.length === 0) {
  //           $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
  //           $wrapperEl.append($cubeShadowEl);
  //         }
  //         $cubeShadowEl.css({ height: `${swiperWidth}px` });
  //       } else {
  //         $cubeShadowEl = $el.find('.swiper-cube-shadow');
  //         if ($cubeShadowEl.length === 0) {
  //           $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
  //           $el.append($cubeShadowEl);
  //         }
  //       }
  //     }

  //     for (let i = 0; i < slides.length; i += 1) {
  //       const $slideEl = slides.eq(i);
  //       let slideIndex = i;
  //       if (isVirtual) {
  //         slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
  //       }
  //       let slideAngle = slideIndex * 90;
  //       let round = Math.floor(slideAngle / 360);
  //       if (rtl) {
  //         slideAngle = -slideAngle;
  //         round = Math.floor(-slideAngle / 360);
  //       }
  //       const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
  //       let tx = 0;
  //       let ty = 0;
  //       let tz = 0;
  //       if (slideIndex % 4 === 0) {
  //         tx = -round * 4 * swiperSize;
  //         tz = 0;
  //       } else if ((slideIndex - 1) % 4 === 0) {
  //         tx = 0;
  //         tz = -round * 4 * swiperSize;
  //       } else if ((slideIndex - 2) % 4 === 0) {
  //         tx = swiperSize + (round * 4 * swiperSize);
  //         tz = swiperSize;
  //       } else if ((slideIndex - 3) % 4 === 0) {
  //         tx = -swiperSize;
  //         tz = (3 * swiperSize) + (swiperSize * 4 * round);
  //       }
  //       if (rtl) {
  //         tx = -tx;
  //       }

  //        if (!isHorizontal) {
  //         ty = tx;
  //         tx = 0;
  //       }

  //        const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
  //       if (progress <= 1 && progress > -1) {
  //         wrapperRotate = (slideIndex * 90) + (progress * 90);
  //         if (rtl) wrapperRotate = (-slideIndex * 90) - (progress * 90);
  //       }
  //       $slideEl.transform(transform$$1);
  //       if (params.slideShadows) {
  //         // Set shadows
  //         let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
  //         let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
  //         if (shadowBefore.length === 0) {
  //           shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
  //           $slideEl.append(shadowBefore);
  //         }
  //         if (shadowAfter.length === 0) {
  //           shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
  //           $slideEl.append(shadowAfter);
  //         }
  //         if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
  //         if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
  //       }
  //     }
  //     $wrapperEl.css({
  //       '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
  //       '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
  //       '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
  //       'transform-origin': `50% 50% -${swiperSize / 2}px`,
  //     });

  //      if (params.shadow) {
  //       if (isHorizontal) {
  //         $cubeShadowEl.transform(`translate3d(0px, ${(swiperWidth / 2) + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
  //       } else {
  //         const shadowAngle = Math.abs(wrapperRotate) - (Math.floor(Math.abs(wrapperRotate) / 90) * 90);
  //         const multiplier = 1.5 - (
  //           (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2)
  //           + (Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2)
  //         );
  //         const scale1 = params.shadowScale;
  //         const scale2 = params.shadowScale / multiplier;
  //         const offset$$1 = params.shadowOffset;
  //         $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${(swiperHeight / 2) + offset$$1}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
  //       }
  //     }

  //     const zFactor = (swiper.browser.isSafari || swiper.browser.isUiWebView) ? (-swiperSize / 2) : 0;
  //     $wrapperEl
  //       .transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
  //   },
  //   setTransition: function(duration) {
  //     const swiper = this;
  //     const { $el, slides } = swiper;
  //     slides
  //       .transition(duration)
  //       .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
  //       .transition(duration);
  //     if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
  //       $el.find('.swiper-cube-shadow').transition(duration);
  //     }
  //   },
  // }
  // on: {
  //   beforeInit() {
  //     const swiper = this;
  //     swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
  //     const overwriteParams = {
  //       slidesPerView: 1,
  //       slidesPerColumn: 1,
  //       slidesPerGroup: 1,
  //       watchSlidesProgress: true,
  //       spaceBetween: 0,
  //       virtualTranslate: true,
  //     };
  //     swiper.params = Object.assign(swiper.params, overwriteParams);
  //     swiper.params = Object.assign(swiper.originalParams, overwriteParams);
  //   },
  //   setTranslate() {
  //     const swiper = this;
  //     const { slides } = swiper;
  //     for (let i = 0; i < slides.length; i += 1) {
  //       const $slideEl = swiper.slides.eq(i);
  //       const offset$$1 = $slideEl[0].swiperSlideOffset;
  //       let tx = -offset$$1;
  //       if (!swiper.params.virtualTranslate) tx -= swiper.translate;
  //       let ty = 0;
  //       if (!swiper.isHorizontal()) {
  //         ty = tx;
  //         tx = 0;
  //       }
  //       const slideOpacity = swiper.params.fadeEffect.crossFade
  //         ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
  //         : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
  //       $slideEl
  //         .css({
  //           opacity: slideOpacity,
  //         })
  //         .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
  //     }
  //   },
  //   setTransition(duration) {
  //     const swiper = this;
  //     const { slides, $wrapperEl } = swiper;
  //     slides.transition(duration);
  //     if (swiper.params.virtualTranslate && duration !== 0) {
  //       let eventTriggered = false;
  //       slides.transitionEnd(() => {
  //         if (eventTriggered) return;
  //         if (!swiper || swiper.destroyed) return;
  //         eventTriggered = true;
  //         swiper.animating = false;
  //         const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
  //         for (let i = 0; i < triggerEvents.length; i += 1) {
  //           $wrapperEl.trigger(triggerEvents[i]);
  //         }
  //       });
  //     }
  //   },
  // }
  // on: {
  //   beforeInit() {
  //     const swiper = this;
  //     swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
  //     swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
  //     const overwriteParams = {
  //       slidesPerView: 1,
  //       slidesPerColumn: 1,
  //       slidesPerGroup: 1,
  //       watchSlidesProgress: true,
  //       spaceBetween: 0,
  //       virtualTranslate: true,
  //     };
  //     swiper.params = Object.assign(swiper.params, overwriteParams);
  //     swiper.originalParams = Object.assign(swiper.originalParams, overwriteParams);
  //   },
  //   setTranslate() {
  //     const swiper = this;
  //     const { $, slides, rtlTranslate: rtl } = swiper;
  //     for (let i = 0; i < slides.length; i += 1) {
  //       const $slideEl = slides.eq(i);
  //       let progress = $slideEl[0].progress;
  //       if (swiper.params.flipEffect.limitRotation) {
  //         progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
  //       }
  //       const offset$$1 = $slideEl[0].swiperSlideOffset;
  //       const rotate = -180 * progress;
  //       let rotateY = rotate;
  //       let rotateX = 0;
  //       let tx = -offset$$1;
  //       let ty = 0;
  //       if (!swiper.isHorizontal()) {
  //         ty = tx;
  //         tx = 0;
  //         rotateX = -rotateY;
  //         rotateY = 0;
  //       } else if (rtl) {
  //         rotateY = -rotateY;
  //       }

  //        $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

  //        if (swiper.params.flipEffect.slideShadows) {
  //         // Set shadows
  //         let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
  //         let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
  //         if (shadowBefore.length === 0) {
  //           shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'left' : 'top'}"></div>`);
  //           $slideEl.append(shadowBefore);
  //         }
  //         if (shadowAfter.length === 0) {
  //           shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'right' : 'bottom'}"></div>`);
  //           $slideEl.append(shadowAfter);
  //         }
  //         if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
  //         if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
  //       }
  //       $slideEl
  //         .transform(`translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  //     }
  //   },
  //   setTransition(duration) {
  //     const swiper = this;
  //     const { slides, activeIndex, $wrapperEl } = swiper;
  //     slides
  //       .transition(duration)
  //       .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
  //       .transition(duration);
  //     if (swiper.params.virtualTranslate && duration !== 0) {
  //       let eventTriggered = false;
  //       // eslint-disable-next-line
  //       slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
  //         if (eventTriggered) return;
  //         if (!swiper || swiper.destroyed) return;

  //         eventTriggered = true;
  //         swiper.animating = false;
  //         const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
  //         for (let i = 0; i < triggerEvents.length; i += 1) {
  //           $wrapperEl.trigger(triggerEvents[i]);
  //         }
  //       });
  //     }
  //   }
  // }
  on: {
    beforeInit() {
      const swiper = this;

      swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
    },
    setTranslate() {
      const swiper = this;
      const {
        width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
      } = swiper;
      const params = swiper.params.coverflowEffect;
      const isHorizontal = swiper.isHorizontal();
      const transform$$1 = swiper.translate;
      const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
      const rotate = isHorizontal ? params.rotate : -params.rotate;
      const translate = params.depth;
      // Each slide offset from center
      for (let i = 0, length = slides.length; i < length; i += 1) {
        const $slideEl = slides.eq(i);
        const slideSize = slidesSizesGrid[i];
        const slideOffset = $slideEl[0].swiperSlideOffset;
        const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

         let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
        let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
        // var rotateZ = 0
        let translateZ = -translate * Math.abs(offsetMultiplier);

         let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
        let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;

         // Fix for ultra small values
        if (Math.abs(translateX) < 0.001) translateX = 0;
        if (Math.abs(translateY) < 0.001) translateY = 0;
        if (Math.abs(translateZ) < 0.001) translateZ = 0;
        if (Math.abs(rotateY) < 0.001) rotateY = 0;
        if (Math.abs(rotateX) < 0.001) rotateX = 0;

         const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

         $slideEl.transform(slideTransform);
        $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
        if (params.slideShadows) {
          // Set shadows
          let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
          let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
          if ($shadowBeforeEl.length === 0) {
            $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
            $slideEl.append($shadowBeforeEl);
          }
          if ($shadowAfterEl.length === 0) {
            $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
            $slideEl.append($shadowAfterEl);
          }
          if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
          if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
        }
      }

       // Set correct perspective for IE10
      if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
        const ws = $wrapperEl[0].style;
        ws.perspectiveOrigin = `${center}px 50%`;
      }
    },
    setTransition(duration) {
      const swiper = this;
      swiper.slides
        .transition(duration)
        .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
        .transition(duration);
    }
  }
  };

  constructor(private platform: Platform,  public sqlservices: DataService, public router: Router, private route: ActivatedRoute,
    public loadingController: LoadingController ) {
      this.load = this.loadingController.create({
        message: 'Cargando'
      });
  }
  ngAfterViewInit(): void {

  }

  cambioPosision(posi: number){
    switch (posi) {
      case 1:
        this.asignado = 'activ';
        this.personali = '';
        this.slides.slidePrev();
        break;
        case 2:
          this.asignado = '';
          this.personali = 'activ';
          this.slides.slideNext();
          break;

      default:
        break;
    }
  }
  ionSlideTouchEnd(event) {
    this.slides.getActiveIndex().then(index => {
      let realIndex = index;
      if (event.target.swiper.isEnd) {  // Added this code because getActiveIndex returns wrong index for last slide
        realIndex =2 - 1;
      }

      console.log('index',realIndex);

      switch (realIndex) {
        case 0:
          this.asignado = 'activ';
          this.personali = '';

          break;
          case 1:
            this.asignado = '';
            this.personali = 'activ';

            break;

        default:
          break;
      }
      // You can now use real index
    });
  }
  startLoading(){
     this.load.present();
  }
  stopLoading(){
      this.load.dismiss();
     console.log('stop');
  }
  ionViewWillEnter() {
    AppComponent.startLoading();
    const d = new Date();
    const day = this.diaSemana[d.getDay()].nombre;
    const month = this.mes[d.getMonth()].nombre;
    this.fecha = day+' '+d.getDate()+' De '+month+' Del ' + d.getFullYear();
    this.loadScroll= true;
    this.infiniteScroll.disabled = true;
    this.results = [];
    this.resultsPendiente = [];
    this.resultsVisito = [];
    const jsonDv = {
      codVend : this.idVendedor,
      posi : 1,
    cantidadMostra : this.pagination*this.maxElement,
    busqueda : this.searchTerm
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.getClienteAVisitarHoyCXC(jsonDv).subscribe( (Data: any)=>{
      console.log(Data);
      console.log(Data.objeto);

// if(Data.resultado === 1){
  Data.objeto.forEach(element => {
    if(element.latitude !== ''){
      element.reg= 'Registrado';
    }else{
      element.reg= 'Sin Registrar';
    }
    if(element.Visito!=='1'){
      this.resultsPendiente.push(element);
    }else if(element.Visito ==='1'){
      this.resultsVisito.push(element);
    }
    this.results.push(element);
  });
  this.loadScroll= false;
  this.infiniteScroll.disabled = false;
  AppComponent.stopLoading();
  this.reloadGraphic();


});


  }

  ngOnInit() {
  }

  reloadGraphic(){

    const jsonDv = {
      codVend : this.idVendedor,
      posi : 1,
    cantidadMostra : this.pagination*this.maxElement,
    busqueda : this.searchTerm
    };
    this.sqlservices.getClienteAVisitarHoyCXCTotal(jsonDv).subscribe( (Data: any)=>{
      console.log(Data);
      console.log(Data.objeto);

// if(Data.resultado === 1){
  this.total = Data.objeto[0].Total;
  this.visitado = Data.objeto[0].Visito;
  this.progress = this.visitado/this.total;

  const datos = [
    {
      labels: 'Sin Visitar',
      value:  Data.objeto[0].NoVisito,
    },
    {
      labels: 'Visitado',
      value: this.visitado,
    }
  ];


  this.doughnutChartMethod(datos);

});
  }
  detailsCliente(codi: string){
    this.router.navigate(['/listado-de-cliente/cliente'], { queryParams: { codigo: codi } });
  }

  doughnutChartMethod(datos: any) {
    try {
      this.doughnutChart.destroy();
    } catch (error) {
      console.log(error);
    }

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Sin Visitar', 'Visitado'],
        datasets: [{
          label: 'Visita del Dia',
          data: datos,
          backgroundColor: [
            // 'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',//rojo
            // 'rgba(54, 162, 235, 0.8)',//ese azul
            // 'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'//verde
          ],
          hoverBackgroundColor: [
            // '#FFCE56',
            '#FF6384',
            // '#36A2EB',
            // '#FFCE56',
            '#FF6384'
          ]
        }]
      },
      options: {
        elements: {

        }
      }
    });


  }

  loadData(event) {
    this.pagination+=1;
    let totalData = 0;
    setTimeout(async () => {
      const jsonDv = {
        codVend: this.idVendedor,
        posi: this.pagination,
      cantidadMostra: this.maxElement,
      busqueda: this.searchTerm
      };

      // eslint-disable-next-line @typescript-eslint/naming-convention
      this.sqlservices.getClienteAVisitarHoyCXC(jsonDv).subscribe((Data: any)=>{
        console.log(Data);
        console.log(Data.objeto);

  // if(Data.resultado === 1){
    Data.objeto.forEach(element => {
      if(element.latitude !== ''){
        element.reg= 'Registrado';
      }else{
        element.reg= 'Sin Registrar';
      }
      if(element.Visito!=='1'){
        this.resultsPendiente.push(element);
      }else if(element.Visito ==='1'){
        this.resultsVisito.push(element);
      }
      this.results.push(element);
    });

    totalData = Data.objeto.length;
    if (totalData === 0 || totalData < this.maxElement) {
      event.target.disabled = true;
    }else{
      event.target.disabled = false;
    }
  });


      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll

    }, 500);
  }

  gotToTop() {
    this.content.scrollToTop(1000);
  }

  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
         this.backToTop = true;
    } else {
         this.backToTop = false;
    }
}

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
