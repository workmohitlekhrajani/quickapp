import {Card, OptionList} from '@shopify/polaris';
import {useState} from 'react';

export function Sidebar() {
  const [selected, setSelected] = useState([]);

  return (
    <Card>
      <OptionList
        title="SCHEMA"
        onChange={setSelected}
       
        options={[
          {value: 'Blog', label: 'Blog'},
          // {value: 'Blog Post', label: 'Blog Post'},
          {value: 'Breadcrumbs', label: 'Breadcrumbs'},
          {value: 'Collection', label: 'Collection'},
          // {value: 'FAQ', label: 'FAQ'},
          {value: 'Homepage', label: 'Homepage'},
          {value: 'Page', label: 'Page'},
          {value: 'Product', label: 'Product'},
          // {value: 'Local Business', label: 'Local Business'},
        ]}
        selected={selected.length!=0?selected:'Blog'}
      />
    </Card>
  );
}