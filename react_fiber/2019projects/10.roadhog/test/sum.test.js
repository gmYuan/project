import sum from '../src/sum';
describe('测试sum',()=>{
    it('1+1',()=>{
        expect(sum(1,1)).toBe(2);
    });
});