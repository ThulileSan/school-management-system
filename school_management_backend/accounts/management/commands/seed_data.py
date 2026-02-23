from django.core.management.base import BaseCommand
from academics.models import Course, Lecturer, Subject
from students.models import Student


class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **options):
        if Course.objects.exists():
            self.stdout.write(self.style.WARNING('Database already has data, skipping seed.'))
            return

        # Courses
        cs = Course.objects.create(name='Computer Science', description='Study of computation, algorithms, and software engineering.')
        ee = Course.objects.create(name='Electrical Engineering', description='Study of electrical systems, circuits, and power generation.')
        ba = Course.objects.create(name='Business Administration', description='Study of management, finance, and organizational leadership.')

        # Lecturers
        l1 = Lecturer.objects.create(first_name='James', last_name='Mokoena', email='james.mokoena@university.ac.za')
        l2 = Lecturer.objects.create(first_name='Sarah', last_name='Naidoo', email='sarah.naidoo@university.ac.za')
        l3 = Lecturer.objects.create(first_name='David', last_name='van der Merwe', email='david.vdm@university.ac.za')

        # Subjects - Computer Science
        s1 = Subject.objects.create(name='Data Structures', description='Arrays, linked lists, trees, and graphs.', course=cs, lecturer=l1)
        s2 = Subject.objects.create(name='Web Development', description='Frontend and backend web technologies.', course=cs, lecturer=l1)
        s3 = Subject.objects.create(name='Database Systems', description='Relational databases, SQL, and data modeling.', course=cs, lecturer=l2)

        # Subjects - Electrical Engineering
        s4 = Subject.objects.create(name='Circuit Analysis', description='Fundamentals of electrical circuits and components.', course=ee, lecturer=l3)
        s5 = Subject.objects.create(name='Digital Electronics', description='Logic gates, microprocessors, and digital systems.', course=ee, lecturer=l3)
        s6 = Subject.objects.create(name='Power Systems', description='Electrical power generation and distribution.', course=ee, lecturer=l2)

        # Subjects - Business Administration
        s7 = Subject.objects.create(name='Financial Accounting', description='Principles of accounting and financial reporting.', course=ba, lecturer=l2)
        s8 = Subject.objects.create(name='Marketing Management', description='Marketing strategies and consumer behavior.', course=ba, lecturer=l3)
        s9 = Subject.objects.create(name='Organizational Behavior', description='Human behavior in organizational settings.', course=ba, lecturer=l1)

        # Students - Computer Science
        st1 = Student.objects.create(first_name='Sipho', last_name='Dlamini', email='sipho.dlamini@student.ac.za', date_of_birth='2000-03-15', course=cs)
        st1.subjects.set([s1, s2, s3])

        st2 = Student.objects.create(first_name='Naledi', last_name='Khumalo', email='naledi.khumalo@student.ac.za', date_of_birth='2001-07-22', course=cs)
        st2.subjects.set([s1, s3])

        st3 = Student.objects.create(first_name='Thabo', last_name='Mthembu', email='thabo.mthembu@student.ac.za', date_of_birth='1999-11-08', course=cs)
        st3.subjects.set([s2, s3])

        # Students - Electrical Engineering
        st4 = Student.objects.create(first_name='Zanele', last_name='Ngcobo', email='zanele.ngcobo@student.ac.za', date_of_birth='2000-01-30', course=ee)
        st4.subjects.set([s4, s5, s6])

        st5 = Student.objects.create(first_name='Bongani', last_name='Sithole', email='bongani.sithole@student.ac.za', date_of_birth='2001-05-12', course=ee)
        st5.subjects.set([s4, s5])

        st6 = Student.objects.create(first_name='Lerato', last_name='Molefe', email='lerato.molefe@student.ac.za', date_of_birth='2000-09-25', course=ee)
        st6.subjects.set([s5, s6])

        # Students - Business Administration
        st7 = Student.objects.create(first_name='Ayanda', last_name='Zulu', email='ayanda.zulu@student.ac.za', date_of_birth='2001-02-14', course=ba)
        st7.subjects.set([s7, s8, s9])

        st8 = Student.objects.create(first_name='Nomvula', last_name='Cele', email='nomvula.cele@student.ac.za', date_of_birth='2000-06-18', course=ba)
        st8.subjects.set([s7, s9])

        st9 = Student.objects.create(first_name='Mandla', last_name='Nkosi', email='mandla.nkosi@student.ac.za', date_of_birth='1999-12-03', course=ba)
        st9.subjects.set([s8, s9])

        self.stdout.write(self.style.SUCCESS(
            f'Seeded: {Course.objects.count()} courses, '
            f'{Lecturer.objects.count()} lecturers, '
            f'{Subject.objects.count()} subjects, '
            f'{Student.objects.count()} students'
        ))
