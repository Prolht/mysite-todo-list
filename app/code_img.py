# !usr/bin/env python
# -*- coding:utf-8 -*-
# 生成图片验证码
import string
import random
from PIL import Image,ImageDraw,ImageFont,ImageFilter

class Picture(object):
    '''
    生成图片验证码
    '''
    def __init__(self,size,background):
        '''
        :param text: 图片验证码上的文字
        :param size: 图片验证码的大小
        :param background: 图片验证码的北京图片
        '''
        self.size = size
        self.background = background

    def create_pic(self):
        # 定义使用Image类实例化基于RGB的(255,255,255)颜色的图片
        self.width,self.height=self.size
        self.img = Image.new("RGB",self.size,background)
        # 实例化画笔
        self.draw = ImageDraw.Draw(self.img, mode="RGB")

    def create_text(self,font_type,font_size,font_num):
        '''
        画验证码的文字
        :param self:
        :param font_type:字体格式
        :param font_size: 字体大小
        :param font_num: 文字的数量
        :param start_xy: 第一个字左上角坐标，元组类型，如（5，5）
        :return:
        '''
        font = ImageFont.truetype(font_type,font_size)
        letterto_test=[]
        for i in range(font_num):
            # 每循环一次生成一个随机字母或数字
            letter=random.choice([random.choice(string.ascii_letters), str(random.randint(0, 9))])
            # 每循环一次生成随机颜色，
            #color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

            # 把生成的字母或数字添加到图片上
            # 图片长度为100px,要生成几个数字或字母则每添加一个,其位置就要向后移动24px
            letterto_test.append(letter)

            print(letter)
            self.draw.text((20 * i + 10, 5),letter,fill=(random.randint(32,127),random.randint(32,127),random.randint(32,127)),font=font)
        letterto_test = ''.join(letterto_test)
        return letterto_test
    def draw_point(self):
        '''
        画点
        :param num: 画点的数量
        :return:
        '''
        for y in range(self.height):
            for x in range(self.width):
                self.draw.point((x,y),fill=(random.randint(64,255),random.randint(64,255),random.randint(64,255)))
    def draw_line(self,num,color):
        '''
        画随机线条
        :param num:
        :return:
        '''
        for i in range(num):
            self.draw.line(
                [
                    (random.randint(0,self.width),random.randint(0,self.height)),
                    (random.randint(0, self.width), random.randint(0, self.height))
                ],
                fill=color
            )
    def opera(self):
        '''
        对生成的对象进行相关操作，比如：旋转，缩放等
        目的是让图片不太好识别
        :return:
        '''
        parms = [
            1 - float(random.randint(1,2))/100,
            0,
            0,
            0,
            1 - float(random.randint(1,10))/100,
            float(random.randint(1, 2)) / 500,
            0.001,
            float(random.randint(1, 2)) / 500
        ]
        self.img = self.img.transform(self.size,Image.PERSPECTIVE,parms)
        self.img = self.img.filter(ImageFilter.EDGE_ENHANCE_MORE)

    def save_pic(self):
        # 把生成的图片保存为“pic.png”格式
        filename = "pic.png"
        with open(filename, "wb") as f:
            self.img.save(f, format("png"))
    def test(self,letterto_test):
        def toverify():
            code = input('请输入验证码:')
            if code==letterto_test:
                print('通过')
                pass
            else:
                print('请重新输入')
                toverify()
        return toverify()





if __name__ == '__main__':
    size = (150,50)
    num_point=150*50
    background = 'white'
    pic = Picture(size,background)
    pic.create_pic()

    pic.draw_point()
    letterto_test=pic.create_text("times.ttf", 30, 5)
    #pic.draw_line(5, (30, 40, 210))
    pic.opera()
    pic.img.filter(ImageFilter.BLUR)
    #pic.img.show()
    pic.save_pic()
    pic.test(letterto_test)