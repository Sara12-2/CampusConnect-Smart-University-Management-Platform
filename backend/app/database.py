from itertools import count


users = []
notices = []
complaints = []
lost_found_items = []
claims = []
notifications = []
staff = []


user_id_counter = count(1)
notice_id_counter = count(1)
complaint_id_counter = count(1)
lost_found_id_counter = count(1)
claim_id_counter = count(1)
notification_id_counter = count(1)
staff_id_counter = count(1)


def next_user_id():
    return next(user_id_counter)


def next_notice_id():
    return str(next(notice_id_counter))


def next_complaint_id():
    return str(next(complaint_id_counter))


def next_lost_found_id():
    return str(next(lost_found_id_counter))


def next_claim_id():
    return str(next(claim_id_counter))


def next_notification_id():
    return str(next(notification_id_counter))


def next_staff_id():
    return str(next(staff_id_counter))