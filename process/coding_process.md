Inline Server Action 사용 가이드
	1.	서버 액션 함수 작성
	•	컴포넌트 내부에서 서버 액션을 정의하려면, 함수 상단에 "use server" 지시어를 작성하여 이 함수가 서버에서 실행될 것임을 명시한다.
	2.	action 속성에 서버 액션 함수 연결
	•	폼의 action 속성에 서버 액션 함수를 직접 추가할 수 있다. 이를 통해 폼 제출 시 서버에서 해당 함수를 호출한다.
	3.	UI에 진행 상황 표시
	•	서버 액션이 진행 중임을 사용자가 알 수 있도록, useFormStatus 훅을 활용하여 폼이 대기(pending) 상태인지 확인하고, 이를 바탕으로 버튼 비활성화 등 UI 피드백을 제공한다.
	4.	useFormStatus 훅 사용 시 주의 사항
	•	useFormStatus는 폼의 상태(대기 중 여부)를 추적하기 위해 가장 가까운 부모 컴포넌트에서 폼을 찾는다. 그러므로 폼이 선언된 컴포넌트 내에서는 useFormStatus를 사용할 수 없다.
	•	대신, 폼의 자식 요소에 위치한 컴포넌트(예: FormButton)에서 useFormStatus를 사용해야 한다.
	5.	useFormStatus의 활용
	•	useFormStatus는 폼이 대기 중이거나 액션이 로딩 중인지 여부를 제공하므로, 이를 통해 버튼 비활성화와 같은 기능을 구현할 수 있다.

-------
useFormState 훅을 사용하여 액션 결과 관리
	1.	useFormState 훅의 목적
	•	useFormState는 액션의 상태와 결과를 추적할 수 있는 훅이다. 서버 액션을 실행할 때 이 훅을 사용하면, 액션의 결과와 상태를 손쉽게 확인할 수 있다.
	2.	useFormState 사용법
	•	useFormState는 첫 번째 인자로 액션 함수를 받고, 두 번째 배열의 인자로 트리거 함수를 반환한다.
	•	반환된 트리거 함수를 호출하여 액션을 실행하며, 이 훅은 실행 중인 액션을 추적하고 결과를 state에 저장하여 반환한다.
 
 ----
 하지만 UI가 action이 return 한 새로운 state로 업데이트 되길 원하기에, 이 컴포넌트를 client component로 만들어야 한다.  
 우리가 "login/page.tsx"를 use client 해버리면, 인라인으로 작성한
  server Action은 더이상 쓸 수가 없게 되어버린다. 

  따라서 client component와 server component를 분리하기 위해서 
  login폴더 안에 이미 만들어둔 page.tsx 와 함께 action.ts를 별도로 만들어서 UI trigger을 걸어주기 위해 따로 분리한다. 

  이 UI trigger은 use server을 처음에 써주어야 한다.  
  그럼 이 것으로 NextJS에게 이 코드가 서버에서만 실행되어야 하는
  action이라고 알려줄 수 있다. 

  --- 

  마지막으로, 우리가 useFormState hook을 사용하고 있기 때문에 , 
  우리가 만든 handleForm은 formData뿐 아니라, 
  action의 이전 state 값과 함께 호출 된다. 
   =>바꿔 말하자면, action이 이전에 action이 return 한 값과 함께 호출되는 것이다. 
   => action이 뭔가를 반환하고, 그 action을 다시 호출한다면, 
   -> action이 이전에 반환했던 값이 이런식으로 
   prevState 로 다시 들어올 것이다. 

   ```typescript
'use server';

export async function handleForm(prevState: any, formData: FormData) {
    console.log(prevState);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return {
        errors:["wrong password","password too short!"],
    };
}
   ```
   여러 절차가 있는 form을 만드는데에 아주 유리하다. 
   나중에 sms인증을 할 때도, 
   1. 처음에 사용자의 전화번호를 null값으로 넣고 sms인증를 보내고, 
   2. sms 인증코드를 보내고 , 
   3. sms인증 코드가 맞는지 토큰을 확인하는 로직을 넣고, 
    이걸 한번 더 호출하며 사용자를 로그인하거나, 에러를 보여 줄 수 있다. 

    기억해야 할건, useFormState를 사용해서, 처음 action을 호출하면, 이 action은 초기 상태인 null 과 함께 호출이 된다. 


    여기서는 state를 조작하거나, onChange같은 이벤트 핸들러를 쓰지 않고, 
    사용자가 UI를 통해 입력한 데이터는 
    내가 작성한 action의 formData로만 간다, 
    input값에 name의 값이 있다면 말이다. 

    모든 input 값에 name 속성을 설정해야 한다. 
    이렇게 하지 않으면, action에 필요한 data가 formData에 포함되지 않을 것이다.  