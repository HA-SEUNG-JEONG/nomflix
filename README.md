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
x,y 같은 css 요소는 animation Motion에만 국한됨

### Gesture

whileTap, whileHover

drag 속성을 이용하면 드래그도 가능하다.

whiledrag라는 속성을 이용하여 backgroundColor를 변경한다고 하면 단순히 "blue"라고 했을 때 animation이 나타나지 않는다.

따라서 rgba 값으로 넣어주면 즉각적으로 변하지 않고 천천히 변한다. 그 이유는 숫자값으로 컬러를 설정했기 때문
