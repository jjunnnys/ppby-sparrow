import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addPost, UPLOAD_IMAGES_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';

const PostForm = () => {
  const { imagePaths, addPostDone, addPostLoading } = useSelector(
    (state) => state.post
  );
  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    if (addPostDone) {
      setText(''); // 서버에서 문제가 생길 수 있기 떄문에 확실하게 post등록이 완료 후 text를 비워준다.
    }
  }, [addPostDone]);

  const dispatch = useDispatch();
  const onSubmit = useCallback(() => {
    dispatch(addPost(text));
  }, [text]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log(e.target.files); // 업로드한 이미지에 대한 정보가 들어 있음
    // FormData 를 만들어서 multipart 형식으로 데이터를 보낸다.
    const imageFormData = new FormData();
    // e.target.files 은 배열이 아님 (배열 형태를 가진 객체) 그래서 forEach를 쓰기 위해 []을 쓴다.
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f); // 키: image(->upload.array의 값과 일치해야 함), 값: f
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType="multipart/form-data" // 이미지를 올리면 multipart/form-data 데이터 형식으로 올라감
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 일이 있었나요?"
      />
      <div>
        {/* image input에서 올린게 upload.array로 전달된다. (name을 맞춰 줌) */}
        {/* 이미지를 설정하고 올리면 onChange 이벤트가 발생한다. */}
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          type="primary"
          style={{ float: 'right' }}
          htmlType="submit"
          loading={addPostLoading}
        >
          짹쨱
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={v} style={{ width: '200px' }} alt={v} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
