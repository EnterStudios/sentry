from __future__ import absolute_import, print_function

__all__ = ['IntegrationManager']

import six

from sentry.exceptions import NotRegistered


# Ideally this and PluginManager abstracted from the same base, but
# InstanceManager has become convulated and wasteful
class IntegrationManager(object):
    def __init__(self):
        self.__values = {}

    def __iter__(self):
        return iter(self.all())

    def all(self):
        for key in six.iterkeys(self.__values):
            provider = self.get(key)
            if provider.is_configured():
                yield provider

    def get(self, key, **kwargs):
        try:
            cls = self.__values[key]
        except KeyError:
            raise NotRegistered(key)
        return cls(**kwargs)

    def exists(self, key):
        return key in self.__values

    def register(self, cls):
        self.__values[cls.id] = cls

    def unregister(self, cls):
        try:
            if self.__values[cls.id] != cls:
                # dont allow unregistering of arbitrary provider
                raise NotRegistered(cls.id)
        except KeyError:
            # we gracefully handle a missing provider
            return
        del self.__values[cls.id]