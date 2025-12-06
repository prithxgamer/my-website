import os
os.system('clear')

import random
import time
def prompt_int(prompt_text):
    """Prompt until the user types only digits; return int."""
    while True:
        s = input(prompt_text).strip()
        if s.isdigit():
            return int(s)
        print("Please type only digits (0-9) and press Enter.")


input("""Hello! This is the pattern game. 
In this game, you will be shown a pattern for a certain amount of time and then it will dissapear.
You will have to memorize the pattern and type the number AND NOTHING ELSE and if you are wrong, you lose,
but if you are correct, you will be sent to the next level. Good Luck and Have FUN!!!
      Click return to start""")
print ("Ready...")
time.sleep(1)
print ("Set...")
time.sleep(1)
print ("Go!!!")
time.sleep(0.5)

num1 = random.randint(1,9)

num2 = random.randint(1,9)
while num1 == num2:
    num2 = random.randint(1,9)

num3 = random.randint(1,9)
while num3 == num2:
    num3 = random.randint(1, 9)

print(num1, end="\r")
time.sleep(1)

print(num2, end="\r")
time.sleep(1)

print(num3, end="\r")
time.sleep(1)

correct_answer = (num1 * 100 + num2 * 10 + num3)

user_answer = prompt_int("Now type the pattern!\n")

if user_answer == correct_answer:
    input("You win! on to level 2! click return to start")
    print ("Ready...")
    time.sleep(1)
    print ("Set...")
    time.sleep(1)
    print ("Go!!!")
    time.sleep(0.5)

    num3 = random.randint(1,9)
    

    num4 = random.randint(1,9)
    while num3 == num4:
        num4 = random.randint(1,9)

    num5 = random.randint(1,9)
    while num4 == num5:
        num5 = random.randint(1,9)

    num6 = random.randint(1,9)
    while num6 == num5:
        num6 = random.randint(1, 9)
    
    print(num3, end="\r")
    time.sleep(0.7)

    print(num4, end="\r")
    time.sleep(0.7)

    print(num5, end="\r")
    time.sleep(0.7)

    print(num6, end="\r")
    time.sleep(0.7)

    correct_answer = (num3 * 1000 + num4 * 100 + num5 * 10 + num6)

    user_answer = prompt_int("Now type the pattern!\n") 

    if user_answer == correct_answer:
        input("Wow, your so good at this! level 3 coming right up. Click return to start")
        print ("Ready...")
        time.sleep(1)
        print ("Set...")
        time.sleep(1)
        print ("Go!!!")
        time.sleep(0.5)

        num2 = random.randint(1,9)

        num3 = random.randint(1,9)
        while num2 == num3:
            num3 = random.randint(1,9)

        num4 = random.randint(1,9)
        while num3 == num4:
            num4 = random.randint(1,9)

        num5 = random.randint(1,9)
        while num4 == num5:
            num5 = random.randint(1,9)

        num6 = random.randint(1,9)
        while num6 == num5:
            num6 = random.randint(1, 9)

        print(num2, end="\r")
        time.sleep(0.6)
        
        print(num3, end="\r")
        time.sleep(0.6)

        print(num4, end="\r")
        time.sleep(0.6)

        print(num5, end="\r")
        time.sleep(0.6)

        print(num6, end="\r")
        time.sleep(0.6)

        correct_answer = (num2 * 10000 + num3 * 1000 + num4 * 100 + num5 * 10 + num6)

        user_answer = prompt_int("Now type the pattern!\n")

        if user_answer == correct_answer:
            input("Your a legend!😎. this next level will be a piece of cake(hopefully). Click return to start")
            print ("Ready...")
            time.sleep(1)
            print ("Set...")
            time.sleep(1)
            print ("Go!!!")
            time.sleep(0.5)
            num1 = random.randint(1,9)

            num2 = random.randint(1,9)
            while num1 == num2:
                num2 = random.randint(1,9)

            num3 = random.randint(1,9)
            while num2 == num3:
                num3 = random.randint(1,9)

            num4 = random.randint(1,9)
            while num3 == num4:
                num4 = random.randint(1,9)

            num5 = random.randint(1,9)
            while num4 == num5:
                num5 = random.randint(1,9)

            num6 = random.randint(1,9)
            while num6 == num5:
                num6 = random.randint(1, 9)

            print(num1, end="\r")
            time.sleep(0.5)

            print(num2, end="\r")
            time.sleep(0.5)
            
            print(num3, end="\r")
            time.sleep(0.5)

            print(num4, end="\r")
            time.sleep(0.5)

            print(num5, end="\r")
            time.sleep(0.5)

            print(num6, end="\r")
            time.sleep(0.5)

            correct_answer = (num1 * 100000 + num2 * 10000 + num3 * 1000 + num4 * 100 + num5 * 10 + num6)

            user_answer = prompt_int("Now type the pattern!\n")

            if user_answer == correct_answer:
                input("Even I could not get that high of a level, and I made the game!")
                print ("Ready...")
                time.sleep(1)
                print ("Set...")
                time.sleep(1)
                print ("Go!!!")
                time.sleep(0.5)
                
                num0 = random.randint(1,9)
                
                num1 = random.randint(1,9)
                while num0 == num1:
                    num1 = random.randint(1,9)

                num2 = random.randint(1,9)
                while num1 == num2:
                    num2 = random.randint(1,9)

                num3 = random.randint(1,9)
                while num2 == num3:
                    num3 = random.randint(1,9)

                num4 = random.randint(1,9)
                while num3 == num4:
                    num4 = random.randint(1,9)

                num5 = random.randint(1,9)
                while num4 == num5:
                    num5 = random.randint(1,9)

                num6 = random.randint(1,9)
                while num6 == num5:
                    num6 = random.randint(1, 9)

                print(num0, end="\r")
                time.sleep(0.4)

                print(num1, end="\r")
                time.sleep(0.4)

                print(num2, end="\r")
                time.sleep(0.4)
                
                print(num3, end="\r")
                time.sleep(0.4)

                print(num4, end="\r")
                time.sleep(0.4)

                print(num5, end="\r")
                time.sleep(0.4)

                print(num6, end="\r")
                time.sleep(0.4)

                correct_answer = (num0 * 1000000 + num1 * 100000 + num2 * 10000 + num3 * 1000 + num4 * 100 + num5 * 10 + num6)

                user_answer = prompt_int("Now type the pattern!\n")

                if user_answer == correct_answer:
                    input("You got this, Last Level!! or is it...")
                    print ("Ready...")
                    time.sleep(1)
                    print ("Set...")
                    time.sleep(1)
                    print ("Go!!!")
                    time.sleep(0.5)
                    
                    num_1 = random.randint(1,9)


                    num0 = random.randint(1,9)
                    while num_1 == num0:
                        num0 = random.randint(1,9)
                    
                    num1 = random.randint(1,9)
                    while num0 == num1:
                        num1 = random.randint(1,9)

                    num2 = random.randint(1,9)
                    while num1 == num2:
                        num2 = random.randint(1,9)

                    num3 = random.randint(1,9)
                    while num2 == num3:
                        num3 = random.randint(1,9)

                    num4 = random.randint(1,9)
                    while num3 == num4:
                        num4 = random.randint(1,9)

                    num5 = random.randint(1,9)
                    while num4 == num5:
                        num5 = random.randint(1,9)

                    num6 = random.randint(1,9)
                    while num6 == num5:
                        num6 = random.randint(1, 9)

                    print(num_1, end="\r")
                    time.sleep(0.3)

                    print(num0, end="\r")
                    time.sleep(0.3)

                    print(num1, end="\r")
                    time.sleep(0.3)

                    print(num2, end="\r")
                    time.sleep(0.3)
                    
                    print(num3, end="\r")
                    time.sleep(0.3)

                    print(num4, end="\r")
                    time.sleep(0.3)

                    print(num5, end="\r")
                    time.sleep(0.3)

                    print(num6, end="\r")
                    time.sleep(0.3)

                    correct_answer = (num_1 * 10000000 + num0 * 1000000 + num1 * 100000 + num2 * 10000 + num3 * 1000 + num4 * 100 + num5 * 10 + num6)

                    user_answer = prompt_int("Now type the pattern!\n")

                    if user_answer == correct_answer:
                        print("You WIN!!!!!!!!!You are officially a Pattern Master!!!This is a time to celebrate!!! WOOHOO!!!")

                
                    if user_answer != correct_answer:
                        print("Last level and you lost!!! Wow, and I thought you were actually good at this. Im disappointed")

                if user_answer != correct_answer:
                    print("Thats just pure bad luck right there, that must have hurt:(")

            if user_answer != correct_answer:
                print("Nice try! but sadly😭😭😭😭😭, you got it incorrect :( :( :( :( :( :( :( :( :( :( :( :( :( :( :( :(")
        else:
            print("Oh no! Good try but you got it wrong. That is unlucky😭😭😭")

    else:
        print("Oof! that sucks, you lost and now you have to restart all the way back to level 1!😭")

else:
    print("Close! but sorry, it was wrong😭")