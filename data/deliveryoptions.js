import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
export const deliveryoptions=[{
  id:'1',
  deliveryDays:7,
  priceCents:0
},{
  id:'2',
  deliveryDays:3,
  priceCents:499
},{
  id:'3',
  deliveryDays:1,
  priceCents:999
}]

export function getdeliveryoption(deliveryoptionid){
  let deliveryoption;

  deliveryoptions.forEach((option)=>{
    if(option.id === deliveryoptionid){
      deliveryoption = option;
    }
  });
  return deliveryoption || deliveryoption[0];
}

function isWeekend(date) {
  const dayOfWeek = date.format('dddd');
  return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
}

export function calculateDeliveryDate(deliveryoption){
      let remainingDays = deliveryoption.deliveryDays;
      let deliveryDate = dayjs();
    
      while (remainingDays > 0) {
        deliveryDate = deliveryDate.add(1, 'day');
    
        if (!isWeekend(deliveryDate)) {
          remainingDays--;
          // This is a shortcut for:
          // remainingDays = remainingDays - 1;
        }
      }
      const datestring = deliveryDate.format('dddd, MMMM D');

      return datestring;
}

export function validDeliveryOption(deliveryoptionid){
  let found = false;
  deliveryoptions.forEach((option)=>{
    if(option.id === deliveryoptionid){
      found = true;
    }
  });
  return found;
}