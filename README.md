### Variants

기본적으로 animation이 있는 stage라 생각하면 된다.

객체 변수를 따로 생성하여 start point,end point를 설정해준다.

```tsx
<Box variants={myVariants} initial="start" animate="end" />
```

initial,animate 이름은 객체 프로퍼티 키와 동일해야 한다.
