import React, {Component} from 'react';
import {
    Card,
    CardImg,
    CardText,
    CardTitle,
    CardBody,
    Breadcrumb,
    BreadcrumbItem,
    NavItem,
    Button,
    Nav,
    ModalHeader,
    ModalBody,
    Modal,
    Row,
    Label,
    Col
} from "reactstrap";
import {Link} from "react-router-dom";
import {Control, Errors, LocalForm} from "react-redux-form";
import {Loading} from "./LoadingComponent";
import {baseUrl} from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger } from "react-animation-components"

const required = (val) => val && val.length
const maxLength = (len) => (val) => !(val) || (val.length <= len)
const minLength = (len) => (val) => (val) && (val.length >= len)


class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen : false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }
    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    handleSubmit = (values) => {
        console.log("Current state:" + JSON.stringify(values))
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment)
        this.toggleModal()
    }

    render() {
        return(
            <>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label>Rating</Label>
                                <Col md={{size:3, offset: 1}}>
                                    <Control.select model=".rating" name="rating"
                                                    className="form-control"
                                                    validators={{required}}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                    <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        wrapper="ul"
                                        component="li"
                                        messages={{
                                            required: "Required"
                                        }}/>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label for="author" md={2}>Your Name</Label>
                                <Col md={10}>
                                    <Control.text model=".author" id="author" name="author"
                                                  placeholder="Your Name"
                                                  className="form-control"
                                                  validators={{
                                                      required,
                                                      minLength: minLength(3),
                                                      maxLength: maxLength(15)
                                                  }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        wrapper="ul"
                                        component="li"
                                        messages={{
                                            required: "Required",
                                            minLength: "Must be greater than 2 characters",
                                            maxLength: "Must be shorter than 16 characters"
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label for="comment" md={2}>Comment</Label>
                                <Col md={10}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                                      rows="12"
                                                      className="form-control" />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={{size:10, offset:2}}>
                                    <Button type="submit" color="primary">
                                        Send Feedback
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Button outline onClick={this.toggleModal}>
                            <span className="fa fa-edit fa-lg">Submit Comment</span>
                        </Button>
                    </NavItem>
                </Nav>
            </>
        )
    }
}



function RenderDish({dish}){
    return(
        <div className="col-12 col-md-5 m-1">
            <FadeTransform in transformProps={{
                exitTransform: "scale(0.5) translateY(-50%)"
            }}>
                <Card>
                    <CardImg width="100%" src={baseUrl + dish.image}  alt={dish.name}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
    </div>
    )
}
function RenderComments({comments, postComment, dishId}) {
    if (comments != null){
        return(
            <div className="col-12  col-md m-1">
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map((comment) =>{
                            let date = new Date(comment.date)
                            date = date.toDateString()
                            return (
                                <Fade in>
                                    <li key={comment.id}>
                                        <p>{comment.comment}</p>
                                        <p>-- {comment.author} , {date}</p>
                                    </li>
                                </Fade>
                            )
                        })}
                    </Stagger>
                </ul>
                <CommentForm dishId={dishId} postComment={postComment}/>
            </div>)
    }
    else return <div></div>
}

function DishDetail(props){
    if (props.isLoading){
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        )
    }
    else if (props.errMess){
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        )
    }
    if (props.dish){
        return (
            <div className="container">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link to="/home">Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to="/menu">Menu</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        {props.dish.name}
                    </BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>Menu</h3>
                    <hr/>
                </div>
                <div className="row">
                    <RenderDish dish={props.dish}/>
                    <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish.id}/>

                </div>



            </div>
        )
    }
    else {
        return <div>{null}</div>
    }

}

export default DishDetail