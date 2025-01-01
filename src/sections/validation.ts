import * as Yup from 'yup';

export const productValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required('اسم المنتج مطلوب ولا يمكن أن يكون فارغًا.')
      .min(1, 'اسم المنتج يجب أن يحتوي على حرف واحد على الأقل.'),

    barcode: Yup.array()
      .of(
        Yup.string()
          .required('كل باركود في المصفوفة مطلوب ولا يمكن أن يكون فارغًا.')
          .min(1, 'يجب أن يحتوي كل باركود على حرف واحد على الأقل.')
      )
      .min(1, 'يجب إدخال باركود واحد على الأقل.')
      .required('الباركود مطلوب ويجب أن يكون مصفوفة تحتوي على سلاسل نصية.'),

    image: Yup.mixed().nullable().notRequired(),

    price: Yup.number()
      .required('السعر اجباري.')
      .positive('السعر يجب أن يكون رقمًا موجبًا.')
      .typeError('السعر مطلوب ويجب أن يكون رقمًا موجبًا.'),

    sell_price: Yup.number()
      .required('سعر البيع اجباري.')
      .positive('سعر البيع يجب أن يكون رقمًا موجبًا.')
      .moreThan(Yup.ref('price'), 'سعر البيع يجب أن يكون أكبر من السعر الأساسي.')
      .typeError('سعر البيع مطلوب ويجب أن يكون رقمًا موجبًا.'),

    quantity: Yup.number()
      .required('الكمية اجباري.')
      .integer('الكمية يجب أن تكون عددًا صحيحًا.')
      .min(0, 'الكمية يجب أن تكون مساوية أو أكبر من 0.')
      .typeError('الكمية يجب أن تكون رقمًا.'),

    category_id: Yup.number()
      .required('الصنف مطلوب.')
      .positive('الصنف يجب أن يكون رقمًا موجبًا.')
      .integer('الصنف يجب أن يكون رقمًا صحيحًا.')
      .typeError('الصنف يجب أن يكون رقمًا.'),
  });

  export const UserValidationSchema = Yup.object().shape({
      name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name cannot exceed 50 characters'),
      username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number'),
  
      phone: Yup.string()
        .required('Phone number is required')
        .matches(
          /^(?:\+213(5|6|7)[0-9]{8}|0(5|6|7)[0-9]{8})$/,
          'Phone number must start with +2135, +2136, +2137, or 05, 06, 07 followed by 8 digits'
        ),
  
      role: Yup.string().required('Role is required'),
    });