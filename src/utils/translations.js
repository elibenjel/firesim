
export const initTrads = ({ t, source, getTradKeys={} }) => {

    const index = source.index;
    const getDefaultKey = key => (index => `${key}${index}`);
    
    Object.entries(source).map(([key, value]) => {
        if (value === null) {
            const getKey = (key in getTradKeys ? getTradKeys[key] : getDefaultKey(key));
            const tradKey = getKey(index);
            source[key] = t(tradKey);
        }
    });
}