#Inheritence
class Person :
    def __init__(self,name,age):
        self.name=name
        self.age=age
    def display(self):
        print(f"Name:{self.name},Age {self.age}")

class Employee(Person):
    def __init__(self,name,age,emp_id,department):
        super().__init__(name,age)
        self.emp_id=emp_id
        self.department=department
    def display(self):
        print(f"Name:{self.name},Age {self.age},Emp_id {self.emp_id},department{self.department}")


emp=Employee('jaya','23',2,'IT')
emp.display()

class Vehicle:
    def drive(self):
        print("Driving a vehicle")

class Car(Vehicle):
    def drive(self):
        print("Driving a car")


car1=Car()
car1.drive()

