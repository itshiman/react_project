import React, { Component } from 'react';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ModalHeader,
  ModalBody,
  Modal,
  Label,
  Col,
  Row,
} from 'reactstrap';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;
const required = (val) => val && val.length;

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCommentFormOpen: false,
    };
    this.toggleCommentForm = this.toggleCommentForm.bind(this);
    this.handleCommentFormSubmit = this.handleCommentFormSubmit.bind(this);
  }

  toggleCommentForm() {
    this.setState({
      isCommentFormOpen: !this.state.isCommentFormOpen,
    });
  }

  handleCommentFormSubmit(values) {
    this.toggleCommentForm();
    this.props.postComment(
      this.props.dishId,
      values.rating,
      values.author,
      values.comment
    );
  }

  render() {
    return (
      <div>
        <Button outline onClick={this.toggleCommentForm}>
          <span className='fa fa-comments fa-lg'></span>Submit Comment
        </Button>
        <Modal
          isOpen={this.state.isCommentFormOpen}
          toggle={this.toggleCommentForm}>
          <ModalHeader toggle={this.toggleCommentForm}>
            Submit Comment
          </ModalHeader>
          <ModalBody>
            <LocalForm
              onSubmit={(values) => this.handleCommentFormSubmit(values)}>
              <Row className='form-group'>
                <Label htmlfor='rating' md={5}>
                  Rating
                </Label>
                <Col md={{ size: 10 }}>
                  <Control.select
                    model='.rating'
                    className='form-control'
                    name='rating'>
                    <option>Please Select</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlfor='author' md={5}>
                  Your Name
                </Label>
                <Col md={10}>
                  <Control.text
                    model='.author'
                    id='author'
                    name='author'
                    placeholder='Your Name'
                    className='form-control'
                    validators={{
                      required,
                      minLength: minLength(3),
                      maxLength: maxLength(15),
                    }}
                  />
                  <Errors
                    className='text-danger'
                    model='.author'
                    show='touched'
                    messages={{
                      required: 'Required',
                      minLength: 'Must be greater than 2 characters',
                      maxLength: 'Must be 15 characters or less',
                    }}
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlfor='comment' md={5}>
                  Comment
                </Label>
                <Col md={10}>
                  <Control.textarea
                    model='.comment'
                    id='comment'
                    name='comment'
                    rows='6'
                    className='form-control'
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Col md={{ size: 10 }}>
                  <Button type='submit' color='primary'>
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

function RenderDish({ dish }) {
  if (dish != null)
    return (
      <FadeTransform
        in
        transformProps={{
          exitTransform: 'scale(0.5) translateY(-50%)',
        }}>
        <Card key={dish.id}>
          <CardImg top src={baseUrl + '/' + dish.image} alt={dish.name} />
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    );
  else return <div></div>;
}

function RenderComments({ comments, postComment, dishId }) {
  if (comments != null) {
    return (
      <div>
        <h4>Comments</h4>
        <Stagger in>
          {comments.map((comment) => {
            return (
              <Fade in>
                <div key={comment.id}>
                  <p>{comment.comment}</p>
                  <p>
                    --{comment.author} ,
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    }).format(new Date(Date.parse(comment.date)))}
                  </p>
                </div>
              </Fade>
            );
          })}
        </Stagger>
        <CommentForm dishId={dishId} postComment={postComment} />
      </div>
    );
  } else return <div></div>;
}

const DishDetail = (props) => {
  if (props.isLoading) {
    return (
      <div className='container'>
        <div className='row'>
          <Loading />
        </div>
      </div>
    );
  } else if (props.errMess) {
    return (
      <div className='container'>
        <div className='row'>
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null)
    return (
      <div className='container'>
        <div className='row'>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to='/menu'>Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className='col-12'>
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-5 m-1'>
            <RenderDish dish={props.dish} />
          </div>
          <div className='col-12 col-md-5 m-1'>
            <RenderComments
              comments={props.comments}
              postComment={props.postComment}
              dishId={props.dish.id}
            />
          </div>
        </div>
      </div>
    );
  else return <div></div>;
};

export default DishDetail;
