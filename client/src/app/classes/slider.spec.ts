import { Options, Slider, SliderValues } from '@app/classes/slider';
import { SliderBandOptions } from './slider-band';
import { Vec2 } from './vec2';

describe('Slider', () => {
  let slider: Slider;

  beforeEach(() => {
    spyOn(document, 'getElementById').and.returnValue(document.createElement('canvas'));
    slider = new Slider({continuousMode: true, canvasId: 'test', position: new Vec2(0,0), color: '#ffffff'} as Options)
    slider.addSlider({id: 1, changed(angle: SliderValues): void {}, min: 0, max: 10, color: '#ffffff', radius: 0} as SliderBandOptions);
    slider.addSlider({id: 2, changed(angle: SliderValues): void {}, min: 0, max: 10, color: '#ffffff', radius: 0} as SliderBandOptions);
  });

  it('should create', () => {
    expect(slider).toBeTruthy();
  });

  it('should create a sliderBand correctly', () => {
    expect(slider['sliders'][1]).toBeTruthy();
  });

  it('set slider value should set the value of the slider properly', () => {
    spyOn<any>(slider, 'drawAll');
    slider.setSliderValue(1, -1);
    expect(slider['drawAll']).toHaveBeenCalled();
    expect(slider['sliders'][1]['endAngle']).toEqual(slider['startAngle']);
  });

  it('set slider value should set the value of the slider properly', () => {
    spyOn<any>(slider, 'drawAll');
    slider.setSliderValue(1, 11);
    expect(slider['drawAll']).toHaveBeenCalled();
    expect(slider['sliders'][1]['endAngle']).toEqual(slider['endAngle']);
  });

  it('set slider value should set the value of the slider properly', () => {
    spyOn<any>(slider, 'drawAll');
    slider.setSliderValue(1, 5);
    expect(slider['drawAll']).toHaveBeenCalled();
    expect(slider['sliders'][1]['endAngle']).toEqual((2 * Math.PI * 5) / 10 - Math.PI / 2)
  });

  it('draw all should.. draw everything', () => {
    spyOn<any>(slider, 'drawScale');
    spyOn<any>(slider, 'drawData');
    spyOn<any>(slider, 'drawArrow');
    spyOn<any>(slider, 'drawKnob');
    slider['drawAll']();
    expect(slider['drawScale']).toHaveBeenCalled();
    expect(slider['drawData']).toHaveBeenCalled();
    expect(slider['drawArrow']).toHaveBeenCalled();
    expect(slider['drawKnob']).toHaveBeenCalled();
  });

  it('draw all should not draw anything if not in sliders', () => {
    spyOn<any>(slider['sliders'], 'hasOwnProperty').and.returnValue(false);
    spyOn<any>(slider, 'drawScale');
    spyOn<any>(slider, 'drawKnob');
    slider['drawAll']();
    expect(slider['drawScale']).not.toHaveBeenCalled();
    expect(slider['drawKnob']).not.toHaveBeenCalled();
  });

  it('drawScale should draw the scale', () => {
    spyOn(slider['context'], 'arc');
    spyOn(slider['context'], 'stroke');
    slider['drawScale'](slider['sliders'][1]);
    expect(slider['context'].arc).toHaveBeenCalled();
    expect(slider['context'].stroke).toHaveBeenCalled();
  });

  it('drawCenterDot should draw the center dot...',  () =>{
    spyOn(slider['context'], 'arc');
    spyOn(slider['context'], 'fill');
    slider['drawCenterDot']();
    expect(slider['context'].arc).toHaveBeenCalled();
    expect(slider['context'].fill).toHaveBeenCalled();
  });

  it('drawData should draw the data', () => {
    spyOn(slider['context'], 'arc');
    spyOn(slider['context'], 'stroke');
    slider['drawData'](slider['sliders'][1]);
    expect(slider['context'].arc).toHaveBeenCalled();
    expect(slider['context'].stroke).toHaveBeenCalled();
  });

  it('calculate angle should properly calculate the angle', () =>{
    spyOn(Math, 'atan2').and.returnValue(1);
    spyOn<any>(Slider, 'radToDeg').and.returnValue(2);
    spyOn<any>(Slider, 'normalizeTan').and.returnValue(3);
    slider['selectedSlider'] = slider['sliders'][1];
    slider['calculateAngles'](new Vec2(0,0));
    expect(slider['selectedSlider'].endAngle).toEqual(1);
    expect(slider['selectedSlider'].angDegrees).toEqual(2);
    expect(Math.round(slider['selectedSlider'].normalizedValue)).toEqual(Math.round(3/2*Math.PI));
  });

  it('calculate angles should do nothing if there is no selectedSlider', () => {
    spyOn(Math, 'atan2');
    slider['calculateAngles'](new Vec2(0,0));
    expect(Math.atan2).not.toHaveBeenCalled();
  });

  it('calculate cursor should return the cursor pos', () => {
    slider['calculateUserCursor']({clientX: 5, clientY: 5} as MouseEvent);
    spyOn(slider['container'], 'getBoundingClientRect').and.returnValue({left: 0, top: 0} as DOMRect);
    slider['calculateUserCursor'];
    expect(slider['mousePos']).toEqual(new Vec2(5,5));
  });

  it('getSelectedSlider should return the selected slider', () => {
    spyOn<any>(slider, 'calculateUserCursor');
    slider['mousePos'] = new Vec2(0,0);
    expect(slider['getSelectedSlider']({} as MouseEvent)).toEqual(slider['sliders'][1]);
  });

  it('getSelected slider should return null if there is no slider', () => {
    spyOn<any>(slider['sliders'], 'hasOwnProperty').and.returnValue(false);
    spyOn<any>(slider, 'calculateUserCursor');
    slider['mousePos'] = new Vec2(-100,-100);
    expect(slider['getSelectedSlider']({} as MouseEvent)).toEqual(null);
  });

  it('getSelected slider should return null if there is no slider', () => {
    spyOn<any>(slider, 'calculateUserCursor');
    slider['mousePos'] = new Vec2(-100,-100);
    expect(slider['getSelectedSlider']({} as MouseEvent)).toEqual(null);
  });

  it('rad to deg should convert properly', () => {
    expect(Slider['radToDeg'](Math.PI)).toEqual(180);
  });

  it('normalize tan should normalize the tan value', () => {
    expect(Slider['normalizeTan'](Math.PI)).toEqual(3 * Math.PI / 2);
  });

  it('normalize tan should normalize the tan value', () => {
    expect(Slider['normalizeTan'](-Math.PI)).toEqual(3 * Math.PI / 2);
  });

  it('handleMouseDown should add a mouseMove event listener is on slider', () => {
    spyOn<any>(slider, 'getSelectedSlider').and.returnValue(slider['sliders'][1]);
    spyOn(slider['theBody'], 'addEventListener');
    slider._handleMouseDown({preventDefault: () => {}} as MouseEvent)
    expect(slider['theBody'].addEventListener).toHaveBeenCalled();
  });

  it('handleMouseDown should add a mouseMove event listener is on slider', () => {
    spyOn<any>(slider, 'getSelectedSlider').and.returnValue(null);
    spyOn(slider['theBody'], 'addEventListener');
    slider._handleMouseDown({preventDefault: () => {}} as MouseEvent)
    expect(slider['theBody'].addEventListener).not.toHaveBeenCalled();
  });

  it('handleMouseUp shoud remove mouseMove event listener', () => {
    spyOn(slider['theBody'], 'removeEventListener');
    slider._handleMouseUp({preventDefault: () => {}} as MouseEvent)
    expect(slider['theBody'].removeEventListener).toHaveBeenCalled();
  });

  it('handleClick should set rotate the slider', () => {
    spyOn<any>(slider, 'getSelectedSlider').and.returnValue(slider['sliders'][1]);
    spyOn(slider, '_rotation');
    slider['currentSlider'] = slider['sliders'][1];
    slider._handleClick({} as MouseEvent);
    expect(slider._rotation).toHaveBeenCalled();
  });

  it('handleClick should set rotate the slider', () => {
    spyOn<any>(slider, 'getSelectedSlider').and.returnValue(null);
    spyOn(slider, '_rotation');
    slider['currentSlider'] = slider['sliders'][1];
    slider._handleClick({} as MouseEvent);
    expect(slider._rotation).not.toHaveBeenCalled();
  });

  it('handleClick should set rotate the slider', () => {
    spyOn<any>(slider, 'getSelectedSlider').and.returnValue(slider['sliders'][2]);
    spyOn(slider, '_rotation');
    slider['currentSlider'] = slider['sliders'][1];
    slider._handleClick({} as MouseEvent);
    expect(slider._rotation).not.toHaveBeenCalled();
  });

  it('rotation should rotate the slider', () => {
    spyOn<any>(slider, 'calculateUserCursor');
    spyOn<any>(slider, 'calculateAngles');
    spyOn<any>(slider, 'drawAll');
    slider._rotation({} as MouseEvent);
    expect(slider['calculateUserCursor']).toHaveBeenCalled();
    expect(slider['calculateAngles']).toHaveBeenCalled();
    expect(slider['drawAll']).toHaveBeenCalled();
  });

  it('rotation should rotate the slider', () => {
    slider['continuousMode'] = false;
    spyOn<any>(slider, 'calculateUserCursor');
    spyOn<any>(slider, 'calculateAngles');
    spyOn<any>(slider, 'drawAll');
    slider._rotation({} as MouseEvent);
    expect(slider['calculateUserCursor']).toHaveBeenCalled();
    expect(slider['calculateAngles']).toHaveBeenCalled();
    expect(slider['drawAll']).toHaveBeenCalled();
  });
});
