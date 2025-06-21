from collections import defaultdict
import json
import os.path
from pkg_resources import resource_filename
from pkg_resources import resource_listdir


_registry = {}


def has(name):
    return name in _registry


def get(name):
    if not has(name):
        data = None
        dirname = name + "_registry"
        for fname in sorted(resource_listdir(__name__, dirname)):
            if os.path.splitext(fname)[1] != ".json":
                continue
            fname = resource_filename(__name__, os.path.join(dirname, fname))
            with open(fname, "r") as fp:
                chunk = json.load(fp)
                if data is None:
                    data = chunk
                elif isinstance(data, list):
                    data.extend(chunk)
                elif isinstance(data, dict):
                    data.updated(chunk)
        if data is None:
            raise ValueError("Failed to load registry {}".format(name))
        save(name, data)
    return _registry[name]


def save(name, data):
    _registry[name] = data


def build_index(base_name, index_name, key, accumulate=False, **predicate):
    def make_key(entry):
        return tuple(entry[k] for k in key) if isinstance(key, tuple) else entry[key]

    def match(entry):
        return all(entry[key] == value for key, value in predicate.items())

    base = get(base_name)
    if accumulate:
        data = defaultdict(list)
        for entry in base:
            if not match(entry):
                continue
            data[make_key(entry)].append(entry)
    else:
        data = dict((make_key(entry), entry) for entry in base if match(entry))
    save(index_name, data)


def manipulate(name, func):
    registry = get(name)
    if isinstance(registry, dict):
        for key, value in registry.items():
            registry[key] = func(key, value)
    elif isinstance(registry, list):
        registry = [func(item) for item in registry]
    save(name, registry)
