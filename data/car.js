class Car {
    brand;
    model;
    speed = 0;
    isTrunkOpen = false;

    constructor(cardetails){
        this.brand = cardetails.brand;
        this.model = cardetails.model;
    } 

    openTrunk(){
      if(this.speed === 0){
        this.isTrunkOpen = true; // Corrected typo
      }
    }

    closeTrunk() {
        this.isTrunkOpen = false; // Corrected typo
    }

    go() {
       this.speed += 5; 
       if(!this.isTrunkOpen){
           this.speed += 5;
       }

       if(this.speed > 200){
           this.speed = 200;
       }
    }

    break() {
        this.speed -= 5;

        if(this.speed < 0) {
            this.speed = 0;
        }
    }

    displayInfo() {
        const trunkStatus = this.isTrunkOpen ? 'open' : 'closed';
        console.log(`${this.brand}, ${this.model}, Speed: ${this.speed} km/hr, Trunk Status: ${trunkStatus}`);
    }
} 

const car1 = new Car ({ brand: 'Toyota', model: 'Corolla'});
const car2 = new Car ({brand: 'Tesla', model: 'Model 3'}); 

console.log(car1);
console.log(car2);



// Ensure trunk is open for car2 when speed is 0
car2.break();
car2.break();
car2.break();
car2.break();
car2.break();
car2.openTrunk();
car2.displayInfo();


class RaceCar extends Car {
    acceleration;
  go() {
    this.speed += this.acceleration;

    if(this.speed > 300){
        this.speed = 300;
    }
  }

  openTrunk() {
    console.log('Race Cars do not have trunk');
  }

  closeTrunk() {
    console.log('Race Cars do not have trunk');
  }

  constructor(cardetails){
    super(cardetails);
    this.acceleration = cardetails.acceleration;
  }

}

const racecar1 = new RaceCar ({ brand: 'McLaren', model: 'F1', acceleration: 20});

console.log(car1);
console.log(car2);

car1.openTrunk();
car2.go();
car2.displayInfo();
racecar1.go();
racecar1.go();
racecar1.go();
racecar1.displayInfo();
racecar1.openTrunk();
racecar1.displayInfo();
racecar1.break();
racecar1.displayInfo();