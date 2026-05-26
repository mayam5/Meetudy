import React from 'react';

function MyPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100%',
        marginTop: '100px',
      }}
    >
      {/* 1. 왼쪽 영역 */}
      <div
        style={{
          width: '40%',
          backgroundColor: '#f0f0f0',

          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: "10px", 
          marginTop: "0"
        }}
      >
        {/* 프로필*/}
        <div>
          <h3 style={{ margin: '20px 0' }}>Nickname</h3>

          {/* 원형 카드 */}
          <div
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              backgroundColor: 'white',

              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            프로필 사진 영역
          </div>

          <div>
            <div>
              <h5>AGE</h5>
              <h5>비공개</h5>
            </div>
            <div>
              <h5>GENDER</h5>
              <h5>F</h5>
            </div>
            <div>
              <h5>REGION</h5>
              <h5>성남시 복정동</h5>
            </div>
          </div>

        </div>
      </div>

      {/* 2. 오른쪽 영역 (시간대 + ) */}
      <div
        style={{
          width: '60%',
          backgroundColor: '#e3e3e3',
          margin: "10px", 
          marginTop: "0px", 
          marginLeft: "0px", 
        }}
      >
        스터디 가능 시간대 영역
      </div>
    </div>
  );
}

export default MyPage;