import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
} from '../reducers/post';
import useInput from '../hooks/useInput';
import { backUrl } from '../config';

const PostForm = () => {
  const [text, onChangeText, setText] = useInput('');
  const dispatch = useDispatch();
  const { imagePaths, addPostDone, addPostLoading } = useSelector(
    (state) => state.post
  );

  const imageInput = useRef();

  useEffect(() => {
    if (addPostDone) {
      return setText(''); // 서버에서 문제가 생길 수 있기 떄문에 확실하게 post등록이 완료 후 text를 비워준다.
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    // 단 이미지가 없을 경우에는 formData를 쓸 필요가 없다.
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p); // 단순히 text로 이루어진 key들은 req.body에 넣어 준다.
    });
    formData.append('content', text); // 단순히 text로 이루어진 key들은 req.body에 넣어 준다.

    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    // FormData 를 만들어서 multipart 형식으로 데이터를 보낸다.
    const imageFormData = new FormData();
    // e.target.files 은 배열이 아님 (배열 형태를 가진 객체) 그래서 forEach를 쓰기 위해 []을 쓴다.
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f); // 키: image(->upload.array의 값과 일치해야 함), 값: f
    });

    return dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({
        type: REMOVE_IMAGE,
        data: index,
      });
    },
    []
  );

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
        {imagePaths.map((v, index) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`${backUrl}/${v}`} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(index)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
