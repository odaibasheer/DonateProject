import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        skills: '',
        availability: '',
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .put('/api/profile', profile)
            .then((response) => {
                setProfile(response.data);
                setIsEditing(false);
            })
            .catch((error) => console.error('Error updating profile:', error));
    };

    return (
        <Container>
            <h2 className="my-4">Volunteer Profile</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="username">Name</Label>
                    <Input
                        type="text"
                        name="username"
                        id="username"
                        value={profile.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="skills">Skills</Label>
                    <Input
                        type="text"
                        name="skills"
                        id="skills"
                        value={profile.skills}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="availability">Availability</Label>
                    <Input
                        type="text"
                        name="availability"
                        id="availability"
                        value={profile.availability}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </FormGroup>
                {isEditing ? (
                    <Button type="submit" color="primary">
                        Save Changes
                    </Button>
                ) : (
                    <Button color="secondary" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </Button>
                )}
            </Form>
        </Container>
    );
};

export default ProfilePage;
