import test from 'node:test';
import assert from 'node:assert/strict';
import { localizedText, localizedValue } from '../shared/multilingual.js';
import { formatPrice } from '../shared/money.js';

test('localized text supports manual Arabic, English fallback, and legacy strings',()=>{
	assert.equal(localizedText({en:'Chicken burger',ar:'برجر دجاج'},'ar'),'برجر دجاج');
	assert.equal(localizedText({en:'Chicken burger',ar:''},'ar'),'Chicken burger');
	assert.equal(localizedText('Legacy burger','ar'),'Legacy burger');
	assert.equal(localizedText(null,'ar'),'');
});

test('localized values preserve manually entered language values',()=>{
	assert.deepEqual(localizedValue('Chicken burger','برجر دجاج'),{en:'Chicken burger',ar:'برجر دجاج'});
	assert.deepEqual(localizedValue('Chicken burger',''),{en:'Chicken burger',ar:''});
});

test('price formatting rounds noisy floating-point amounts to two decimals',()=>{
	assert.equal(formatPrice(34.0000007),'34.00');
	assert.equal(formatPrice(12.345),'12.35');
	assert.equal(formatPrice('invalid'),'0.00');
});