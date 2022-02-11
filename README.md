결과물

![image](https://user-images.githubusercontent.com/88266129/153626129-9288c81e-73e3-460f-bdea-87687acb7930.png)
![image](https://user-images.githubusercontent.com/88266129/153626245-fefc9d6f-81f6-41fb-af36-f8bc1b430e4b.png)

![image](https://user-images.githubusercontent.com/88266129/153626411-a11084a6-e62c-4b3a-b961-e5468f31bd67.png)





### Variants

기본적으로 animation이 있는 stage라 생각하면 된다.

객체 변수를 따로 생성하여 start point,end point를 설정해준다.

```tsx
<Box variants={myVariants} initial="start" animate="end" />
```

initial,animate 이름은 객체 프로퍼티 키와 동일해야 한다.

부모 컴포넌트가 variant와 initial의 variant 이름 animate의 이름을 갖고 있을 때,Motion은 이걸 복사해서 자식에게 전달한다.(기본적인 동작)

`delayChildren`: delay 시간 후에 자식 애니메이션이 시작됨

`staggerChildren`: 자식 컴포넌트의 애니메이션에 지속시간만큼 시차를 둘 수 있다.
x,y 같은 css 요소는 animation Motion에만 국한됨

### Gesture

`whileTap`, `whileHover`

drag 속성을 이용하면 드래그도 가능하다.

`whiledrag`라는 속성을 이용하여 backgroundColor를 변경한다고 하면 단순히 "blue"라고 했을 때 animation이 나타나지 않는다.

따라서 rgba 값으로 넣어주면 즉각적으로 변하지 않고 천천히 변한다. 그 이유는 숫자값으로 컬러를 설정했기 때문

constraint

drag="x"로 하면 x축 내에서만 드래그가 가능하고 y축으로는 불가능하다.

`dragConstraints`- 드래그 가능한 영역까지로 제한

`dragSnapToOrigin` - 원래 위치로 되돌아가게 하는 속성

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

드래그할때마다 위치에 따라 정사각형 크기를 다르게 하고 싶은 경우

`useTransform`을 이용한다.

첫번째 인자는 `useMotionValue`에서 불러온 값, 두번째인자는 `input array` 세번째 인자는 `output array`

주의할 점은 input array와 output array는 서로 같은 배열 크기를 가져야 한다.

```tsx
<Box style={{ x, scale: transform }} drag="x" dragSnapToOrigin />
```

`useTransform`에서 가져온 값을 style에 적용시키면 드래그한 위치에 따라 크기가 달라진다.

`useViewportScroll` : viewport가 스크롤돨 때 업데아트 되는 MotionValue를 return

```tsx
const SVG = styled.svg`
  width: 300px;
  height: 300px;
`;

<SVG aria-hidden="true" focusable="false" viewBox="0 0 448 512">
  <path fill="currentColor"></path>
</SVG>;
```

`currentColor`는 path가 ``SVG`의 color를 가질 거라는 의미다.

`pathLength` : 현재 위치까지의 path 길이

특정 property의 animation duration을 단독으로 변경하는 방법도 있다.

`AnimationPresence` : 컴포넌트가 제거될 때 제거되는 컴포넌트에 animation을 줄 수 있다.

AnimationPresence의 규칙은 visible 상태여야 한다. 그리고 내부에는 조건문이 있어야 한다.

```tsx
{
  showing ? (
    <AnimatePresence>
      {" "}
      <Box />{" "}
    </AnimatePresence>
  ) : null;
}
```

이렇게 작성하면 동작이 되지 않는다.

`exit` : element가 사라질 때 어떤 animation을 발생시킬지를 정하는 것

```tsx
function App() {
  const [visible, setVisible] = useState(1);
  return (
    <Wrapper>
      <AnimatePresence>
        <Box
          variants={boxVariants}
          initial="invisible"
          animate="visible"
          exit="exit"
          key={visible}
        >
          {visible}
        </Box>
      </AnimatePresence>
    </Wrapper>
  );
}
```

key값으로 i가 아닌 visible로 바꾸면 React는 `<Box/>`가 사라졌다고 생각한다. 그 다음에 exit animation이 실행된다.

`custom` : `variants`에 데이터를 보낼 수 있게 해주는 property

variants는 원래 여러 object를 가진 object였지만 custom을 사용할 때는 varinat를 `object`를 return하는 function으로 바꿔야 한다.

그리고 AnimatePresence component에도 custom을 넣어야 한다.

`exitBeforeEnter` : exit animation이 완전히 끝나고 나면 다음 element를 보여줌

`layout animation`

Props

`layout` : element에게 전달하면 그 element의 layout이 바뀔 때 animate된다.

`shared layout animation`

'layoutId` : 서로 다른 component에 layoutId를 같게 하면 이 component들은 연결된다.
