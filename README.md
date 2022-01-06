### Variants

기본적으로 animation이 있는 stage라 생각하면 된다.

객체 변수를 따로 생성하여 start point,end point를 설정해준다.

```tsx
<Box variants={myVariants} initial="start" animate="end" />
```

initial,animate 이름은 객체 프로퍼티 키와 동일해야 한다.

부모 컴포넌트가 variant와 initial의 variant 이름 animate의 이름을 갖고 있을 때,Motion은 이걸 복사해서 자식에게 전달한다.(기본적인 동작)

delayChildren: delay 시간 후에 자식 애니메이션이 시작됨
staggerChildren: 자식 컴포넌트의 애니메이션에 지속시간만큼 시차를 둘 수 있다.
