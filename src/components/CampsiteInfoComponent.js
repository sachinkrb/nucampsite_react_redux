import React, { Component } from "react";
import {
    Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem,
    Label, Modal, ModalHeader, ModalBody, Button, Row
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Transform } from 'react-animation-components';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <Transform enterTransform="rotate(360deg)" in>
                        <CardBody>
                            <CardText>{campsite.description}</CardText>
                        </CardBody>
                    </Transform>

                </Card>
            </FadeTransform>
        </div>
    );

}
function RenderComments({ comments, postComment, campsiteId }) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                <Fade in>
                    {
                        comments.map(comment => {
                            return (
                                <Fade in key={comment.id}>
                                    <div>
                                        <p>
                                            {comment.text}<br />
                                            -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                                        </p>
                                    </div>
                                </Fade>
                            );
                        })
                    }
                </Fade>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
            </div>
        );
    }
}

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id} />
                </div>
            </div>

        );
    }
    return (
        <div></div>
    );
}
class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render() {
        return (
            <React.Fragment>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}> Submit Comment</ModalHeader>
                    <ModalBody>
                        <div className="container" >
                            <div className="row">
                                <div className="col">
                                    <LocalForm onSubmit={values => this.handleSubmit(values)}>
                                        <Row className="form-group">
                                            <Label htmlFor="rating">Rating</Label>
                                            <Control.select model=".rating" id="rating" name="rating"
                                                className="form-control">
                                                <option>Select Rating</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Control.select>
                                        </Row>

                                        <Row className="form-group">
                                            <Label htmlFor="author">Your Name</Label>
                                            <Control.text model=".author" id="author" name="author"
                                                placeholder="Your Name"
                                                className="form-control"
                                                validators={{
                                                    required,
                                                    minLength: minLength(2),
                                                    maxLength: maxLength(15)
                                                }}
                                            />
                                            <Errors
                                                className="text-danger"
                                                model=".author"
                                                show="touched"
                                                component="div"
                                                messages={{
                                                    required: 'Required',
                                                    minLength: 'Must be at least 2 characters',
                                                    maxLength: 'Must be 15 characters or less'
                                                }}
                                            />
                                        </Row>

                                        <Row className="form-group">
                                            <Label htmlFor="text" >Comment</Label>
                                            <Control.textarea model=".text" id="text" name="text"
                                                rows="6"
                                                className="form-control"
                                            />
                                        </Row>

                                        <Row className="form-group">
                                            <Button type="submit" color="primary">
                                                Submit
                                    </Button>
                                        </Row>
                                    </LocalForm>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Transform enterTransform="rotate(360deg)" in>
                    <Button outline onClick={this.toggleModal}>
                        <i className="fa fa-pencil fa-lg" /> Submit Comment
                                </Button>
                </Transform>
            </React.Fragment>

        );

    }

}
export default CampsiteInfo;