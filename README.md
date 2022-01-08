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

constraint

drag="x"로 하면 x축 내에서만 드래그가 가능하고 y축으로는 불가능하다.

dragConstraints - 드래그 가능한 영역까지로 제한

dragSnapToOrigin - 원래 위치로 되돌아가게 하는 속성

### Motion Value

특정한 값을 계속 추적할 수 있도록 해줌

x축의 위치에 따라 배경색 같은 것을 바꾸고 싶을 때, useMotionValue를 이용하면 되고 기본값은 `0`이다.

```tsx
const x = useMotionValue(0);
console.log(x);
```

MotionValue가 바뀌면 x좌표는 바뀌지만 rendering은 한번만 실행되고 다시 rendering 되지 않는다.

```tsx
useEffect(() => {
  x.onChange(() => console.log(x.get()));
}, [x]);
```

useEffect,onChange event를 사용하여 x좌표가 바뀔때마다 console에 찍히도록 한다.

```tsx
<Box style={{ x }} drag="x" dragSnapToOrigin />
```

`useMotionValue`를 이용하여 변수를 생성하고 그 변수를 style에 넣을 때 사용자가 drag할때마다 그 변수 값이 계속 업데이트된다.
