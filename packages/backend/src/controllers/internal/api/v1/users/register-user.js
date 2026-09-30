import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';

export default async function registerUser(request, response) {
  const { fullName, email, password } = request.body;

  const user = await User.registerUser({
    fullName,
    email,
    password,
  });

  renderObject(response, user, { status: 201 });
}
