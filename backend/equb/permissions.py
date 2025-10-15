from rest_framework import permissions
from .models import Membership

class IsGroupCreatorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user

class IsMemberOfGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        group_id = view.kwargs.get("group_pk") or request.data.get("group")
        if not group_id:
            return True
        user = request.user
        return Membership.objects.filter(user=user, group_id=group_id).exists()

class IsMembershipOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user
